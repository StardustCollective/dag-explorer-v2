import { Draft } from "immer";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

export type IUpdateContext<Context> = (
  updater: (context: Draft<Context>) => void
) => void;

export type IStateMachine<
  Context,
  StateKey extends string,
  EventKey extends string
> = {
  [K in StateKey]: {
    events: {
      [E in EventKey]?: {
        target: StateKey;
        guard?: (machine: { context: Context }) => void | Promise<void>;
      };
    };
    onEntry?: (machine: {
      context: Context;
      set: IUpdateContext<Context>;
      send: (event: EventKey) => Promise<void>;
    }) => void | Promise<void>;
    onEntryError?: (machine: {
      error: unknown;
      context: Context;
      set: IUpdateContext<Context>;
      send: (event: EventKey) => Promise<void>;
    }) => void | Promise<void>;
    onExit?: (machine: {
      context: Context;
      set: IUpdateContext<Context>;
    }) => void | Promise<void>;
    onExitError?: (machine: {
      error: unknown;
      context: Context;
      set: IUpdateContext<Context>;
    }) => void | Promise<void>;
  };
};

export type IStateMachineStore<Machine extends IStateMachine<any, any, any>> = {
  state: Machine extends IStateMachine<any, infer StateKey, any>
    ? StateKey
    : never;
  context: Machine extends IStateMachine<infer Context, any, any>
    ? Context
    : never;
  send: (
    event: Machine extends IStateMachine<any, any, infer EventKey>
      ? EventKey
      : never
  ) => Promise<void>;
  set: IUpdateContext<
    Machine extends IStateMachine<infer Context, any, any> ? Context : never
  >;
};

export const createStateMachineStore = <
  Machine extends IStateMachine<any, any, any>
>(
  machine: Machine,
  state: Machine extends IStateMachine<any, infer StateKey, any>
    ? StateKey
    : never,
  context: Machine extends IStateMachine<infer Context, any, any>
    ? Context
    : never
) =>
  createStore<IStateMachineStore<Machine>>()(
    immer((set, get) => {
      const setContext: IUpdateContext<
        Machine extends IStateMachine<infer Context, any, any> ? Context : never
      > = (updater) => {
        set((state) => {
          updater(state.context);
        });
      };

      const send = async (
        event: Machine extends IStateMachine<any, any, infer EventKey>
          ? EventKey
          : never
      ) => {
        const currentState = get().state;
        const currentStateConfig = machine[currentState];

        if (!currentStateConfig) {
          throw new Error(`Invalid state: ${currentState}`);
        }

        const eventConfig = currentStateConfig.events[event];

        if (!eventConfig) {
          throw new Error(`Invalid event for state ${currentState}: ${event}`);
        }

        await eventConfig.guard?.({
          context: get().context,
        });

        try {
          await currentStateConfig.onExit?.({
            context: get().context,
            set: setContext,
          });
        } catch (error) {
          await currentStateConfig.onExitError?.({
            error,
            context: get().context,
            set: setContext,
          });
          throw error;
        }

        const nextStateConfig = machine[eventConfig.target];

        if (!nextStateConfig) {
          throw new Error(`Invalid target state: ${eventConfig.target}`);
        }

        set((state) => {
          state.state = eventConfig.target;
        });

        try {
          await nextStateConfig.onEntry?.({
            context: get().context,
            set: setContext,
            send,
          });
        } catch (error) {
          await nextStateConfig.onEntryError?.({
            error,
            context: get().context,
            set: setContext,
            send,
          });
          throw error;
        }
      };

      return { state, context, send, set: setContext };
    })
  );
