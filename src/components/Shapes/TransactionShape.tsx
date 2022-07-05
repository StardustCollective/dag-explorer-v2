import { Circle } from 'phosphor-react';

export const TransactionShape = ({ size, classname }: { size?: string; classname?: string }) => {
  return (
    <Circle
      className={classname ? classname : undefined}
      color={'#00AC34'}
      size={size ? size : undefined}
      weight="fill"
    />
  );
};
