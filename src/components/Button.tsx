import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';
type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { to?: string; href?: string; variant?: 'primary' | 'secondary' }>;
export default function Button({ to, href, variant = 'primary', children, className, ...rest }: Props) {
  const style = cn('button', `button-${variant}`, className);
  const content = <><span className="button-sweep" aria-hidden="true" /><span className="button-label">{children}</span></>;
  if (href) return <a className={style} href={href} target="_blank" rel="noreferrer" data-cursor="hover">{content}</a>;
  return to ? <Link className={style} to={to} data-cursor="hover">{content}</Link> : <button {...rest} className={style} data-cursor="hover">{content}</button>;
}
