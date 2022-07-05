import { Triangle } from 'phosphor-react';

export const AddressShape = ({ size, classname }: { size?: string; classname?: string }) => {
  return (
    <Triangle
      className={classname ? classname : undefined}
      color={'#2E73FA'}
      size={size ? size : undefined}
      weight="fill"
    />
  );
};
