import { Icon, IconProps } from 'boot-cell';
import classNames from 'classnames';
import { FC } from 'web-cell';

export interface BGIconProps extends IconProps {
    type?: 'square' | 'circle';
}

export const BGIcon: FC<BGIconProps> = ({
    className = '',
    type = 'square',
    color = 'primary',
    children,
    ...props
}) => (
    <span
        className={classNames(
            'd-inline-block',
            'p-3',
            `bg-${color}`,
            `rounded${type === 'square' ? '' : '-circle'}`,
            className
        )}
        {...props}
    >
        <Icon color={color === 'light' ? 'dark' : 'light'} {...props} />
    </span>
);
