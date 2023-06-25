import Link from "next/link";
import { forwardRef } from "react";

const MenuLinkItem = forwardRef((props, ref) => {
  let { href, children, onClick, ...rest } = props;
  return (
    <Link href={href}>
      <a ref={ref} {...rest} onClick={onClick}>
        {children}
      </a>
    </Link>
  );
});

MenuLinkItem.displayName = "MenuLinkItem";
export default MenuLinkItem;
