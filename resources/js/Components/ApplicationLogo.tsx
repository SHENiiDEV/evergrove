import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M24 4L13 18H19L9 30H19L11 40H22V44H26V40H37L29 30H39L29 18H35L24 4Z"
                fill="currentColor"
            />
        </svg>
    );
}

