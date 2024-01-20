import classNames from 'classnames';
import { FC, WebCellProps } from 'web-cell';

export interface InputGroupProps extends WebCellProps<HTMLDivElement> {
    size?: 'sm' | 'lg';
}

export const InputGroup: FC<InputGroupProps> = ({
    className = '',
    size,
    children,
    ...props
}) => (
    <div
        className={classNames(
            'input-group',
            size && `input-group-${size}`,
            className
        )}
        {...props}
    >
        {children}
    </div>
);

export const InputGroupText: FC<WebCellProps<HTMLSpanElement>> = ({
    className = '',
    children,
    ...props
}) => (
    <span className={`input-group-text ${className}`} {...props}>
        {children}
    </span>
);
