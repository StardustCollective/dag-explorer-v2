import styles from './ArrowButton.module.scss';

export const ArrowButton = ({
  forward,
  handleClick,
  disabled = false,
}: {
  forward?: boolean;
  handleClick: () => void;
  disabled?: boolean;
}) => {
  const button = forward ? (
    <button
      className={styles.forward}
      onClick={() => {
        handleClick();
      }}
      disabled={disabled}
    >
      <div className={styles.iconRight} />
    </button>
  ) : (
    <button
      className={styles.back}
      onClick={() => {
        handleClick();
      }}
      disabled={disabled}
    >
      <div className={styles.iconLeft} />
    </button>
  );
  return button;
};
