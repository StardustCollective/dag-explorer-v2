import { Square } from 'phosphor-react';

export const SnapshotShape = ({ size, classname }: { size?: string; classname?: string }) => {
  return (
    <Square
      className={classname ? classname : undefined}
      color={'#7C4FFF'}
      size={size ? size : undefined}
      weight="fill"
    />
  );
};
