import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/logo.png"
            alt="Animex Logo"
            className={props.className ?? "h-8 w-auto"}
        />
    );
}
