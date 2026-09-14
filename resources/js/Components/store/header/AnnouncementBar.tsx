import { X } from 'lucide-react';
import { useState } from 'react';

const MESSAGES = [
    'Every Item Plants 10 Trees • 120M+ Planted',
    'Sustainable Fabrics: Hemp, Organic Cotton & Tencel',
    'Free Shipping on Orders Over €100',
];

export default function AnnouncementBar() {
    const [visible, setVisible] = useState(true);

    if (!visible) {
        return null;
    }

    return (
        <div className="relative bg-ink text-paper">
            <div className="u-container flex h-9 items-center justify-center">
                <ul className="flex items-center gap-8">
                    {MESSAGES.map((message, index) => (
                        <li
                            key={message}
                            className={
                                index === 0
                                    ? 'u-label'
                                    : 'u-label hidden md:block'
                            }
                        >
                            {message}
                        </li>
                    ))}
                </ul>
            </div>

            <button
                type="button"
                onClick={() => setVisible(false)}
                aria-label="Dismiss announcement"
                className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center text-paper/70 transition-colors hover:text-paper"
            >
                <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
        </div>
    );
}
