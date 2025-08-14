export type IParallelExecutionJobResult<T> = { id: string | number; result: T };

export class ParallelExecution<T = any> {
  #jobs: Map<
    IParallelExecutionJobResult<T>["id"],
    Promise<IParallelExecutionJobResult<T>>
  >;

  constructor() {
    this.#jobs = new Map();
  }

  executeJob(
    id: IParallelExecutionJobResult<T>["id"],
    jobExecutor: (id: IParallelExecutionJobResult<T>["id"]) => Promise<T>
  ) {
    const resolveJob = async (): Promise<IParallelExecutionJobResult<T>> => {
      try {
        const result = await jobExecutor(id);
        return { id, result };
      } catch (e) {
        console.log(
          `[ParallelExecutionError]: Job id ${id} failed, throwing error`
        );
        throw e;
      }
    };

    this.#jobs.set(id, resolveJob());
  }

  resolveJobs() {
    return Promise.all([...this.#jobs.values()]);
  }
}
