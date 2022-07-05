import { CheckCircle } from 'phosphor-react';

export const CheckCircleShape = ({ size, classname }: { size?: string; classname?: string }) => {
  return (
    <CheckCircle
      className={classname ? classname : undefined}
      color={'#009A28'}
      size={size ? size : undefined}
      weight="fill"
    />
  );
};
