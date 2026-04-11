import Link from 'next/link';
import { forwardRef, ReactNode, MouseEventHandler } from 'react';
import type { LinkProps } from 'next/link';

interface MenuLinkItemProps extends Omit<LinkProps, 'href'> {
  href: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const MenuLinkItem = forwardRef<HTMLAnchorElement, MenuLinkItemProps>(
  (props, ref) => {
    const { href, children, onClick, ...rest } = props;
    return (
      <Link href={href} ref={ref} {...rest} onClick={onClick}>
        {children}
      </Link>
    );
  }
);

MenuLinkItem.displayName = 'MenuLinkItem';
export default MenuLinkItem;
