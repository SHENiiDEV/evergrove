import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cn } from '@/lib/cn';
import { Gender } from '@/types/shop';
import { Check, Info, Ruler, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SizeGuideModalProps {
    open: boolean;
    onClose: () => void;
    defaultGender?: Gender;
}

type Unit = 'cm' | 'in';
type CategoryTab = 'tops' | 'bottoms' | 'outerwear' | 'accessories';

interface SizeRow {
    size: string;
    chestCm: string;
    chestIn: string;
    waistCm: string;
    waistIn: string;
    hipsCm: string;
    hipsIn: string;
    sleeveCm?: string;
    sleeveIn?: string;
    inseamCm?: string;
    inseamIn?: string;
}

const MEN_TOPS: SizeRow[] = [
    { size: 'XS', chestCm: '86–91', chestIn: '34–36', waistCm: '71–76', waistIn: '28–30', hipsCm: '86–91', hipsIn: '34–36', sleeveCm: '81–84', sleeveIn: '32–33' },
    { size: 'S', chestCm: '91–97', chestIn: '36–38', waistCm: '76–81', waistIn: '30–32', hipsCm: '91–97', hipsIn: '36–38', sleeveCm: '84–86', sleeveIn: '33–34' },
    { size: 'M', chestCm: '97–104', chestIn: '38–41', waistCm: '81–86', waistIn: '32–34', hipsCm: '97–104', hipsIn: '38–41', sleeveCm: '86–89', sleeveIn: '34–35' },
    { size: 'L', chestCm: '104–112', chestIn: '41–44', waistCm: '86–94', waistIn: '34–37', hipsCm: '104–112', hipsIn: '41–44', sleeveCm: '89–91', sleeveIn: '35–36' },
    { size: 'XL', chestCm: '112–122', chestIn: '44–48', waistCm: '94–104', waistIn: '37–41', hipsCm: '112–122', hipsIn: '44–48', sleeveCm: '91–94', sleeveIn: '36–37' },
    { size: 'XXL', chestCm: '122–132', chestIn: '48–52', waistCm: '104–114', waistIn: '41–45', hipsCm: '122–132', hipsIn: '48–52', sleeveCm: '94–97', sleeveIn: '37–38' },
];

const MEN_BOTTOMS: SizeRow[] = [
    { size: 'XS (28)', chestCm: '-', chestIn: '-', waistCm: '71–76', waistIn: '28–30', hipsCm: '86–91', hipsIn: '34–36', inseamCm: '79', inseamIn: '31' },
    { size: 'S (30)', chestCm: '-', chestIn: '-', waistCm: '76–81', waistIn: '30–32', hipsCm: '91–97', hipsIn: '36–38', inseamCm: '80', inseamIn: '31.5' },
    { size: 'M (32)', chestCm: '-', chestIn: '-', waistCm: '81–86', waistIn: '32–34', hipsCm: '97–104', hipsIn: '38–41', inseamCm: '81', inseamIn: '32' },
    { size: 'L (34)', chestCm: '-', chestIn: '-', waistCm: '86–94', waistIn: '34–37', hipsCm: '104–112', hipsIn: '41–44', inseamCm: '82', inseamIn: '32.5' },
    { size: 'XL (36)', chestCm: '-', chestIn: '-', waistCm: '94–104', waistIn: '37–41', hipsCm: '112–122', hipsIn: '44–48', inseamCm: '83', inseamIn: '32.5' },
    { size: 'XXL (38)', chestCm: '-', chestIn: '-', waistCm: '104–114', waistIn: '41–45', hipsCm: '122–132', hipsIn: '48–52', inseamCm: '84', inseamIn: '33' },
];

const WOMEN_TOPS: SizeRow[] = [
    { size: 'XS (UK 6)', chestCm: '81–85', chestIn: '32–33.5', waistCm: '63–67', waistIn: '25–26.5', hipsCm: '89–93', hipsIn: '35–36.5', sleeveCm: '76–79', sleeveIn: '30–31' },
    { size: 'S (UK 8-10)', chestCm: '86–90', chestIn: '34–35.5', waistCm: '68–72', waistIn: '27–28.5', hipsCm: '94–98', hipsIn: '37–38.5', sleeveCm: '79–81', sleeveIn: '31–32' },
    { size: 'M (UK 12)', chestCm: '91–96', chestIn: '36–38', waistCm: '73–78', waistIn: '29–30.5', hipsCm: '99–104', hipsIn: '39–41', sleeveCm: '81–84', sleeveIn: '32–33' },
    { size: 'L (UK 14)', chestCm: '97–104', chestIn: '38.5–41', waistCm: '79–86', waistIn: '31–34', hipsCm: '105–112', hipsIn: '41.5–44', sleeveCm: '84–86', sleeveIn: '33–34' },
    { size: 'XL (UK 16)', chestCm: '105–112', chestIn: '41.5–44', waistCm: '87–96', waistIn: '34.5–38', hipsCm: '113–120', hipsIn: '44.5–47', sleeveCm: '86–89', sleeveIn: '34–35' },
    { size: 'XXL (UK 18)', chestCm: '113–120', chestIn: '44.5–47', waistCm: '97–106', waistIn: '38.5–42', hipsCm: '121–128', hipsIn: '47.5–50.5', sleeveCm: '89–91', sleeveIn: '35–36' },
];

const WOMEN_BOTTOMS: SizeRow[] = [
    { size: 'XS (UK 6)', chestCm: '-', chestIn: '-', waistCm: '63–67', waistIn: '25–26.5', hipsCm: '89–93', hipsIn: '35–36.5', inseamCm: '76', inseamIn: '30' },
    { size: 'S (UK 8-10)', chestCm: '-', chestIn: '-', waistCm: '68–72', waistIn: '27–28.5', hipsCm: '94–98', hipsIn: '37–38.5', inseamCm: '77', inseamIn: '30.5' },
    { size: 'M (UK 12)', chestCm: '-', chestIn: '-', waistCm: '73–78', waistIn: '29–30.5', hipsCm: '99–104', hipsIn: '39–41', inseamCm: '78', inseamIn: '31' },
    { size: 'L (UK 14)', chestCm: '-', chestIn: '-', waistCm: '79–86', waistIn: '31–34', hipsCm: '105–112', hipsIn: '41.5–44', inseamCm: '79', inseamIn: '31' },
    { size: 'XL (UK 16)', chestCm: '-', chestIn: '-', waistCm: '87–96', waistIn: '34.5–38', hipsCm: '113–120', hipsIn: '44.5–47', inseamCm: '80', inseamIn: '31.5' },
    { size: 'XXL (UK 18)', chestCm: '-', chestIn: '-', waistCm: '97–106', waistIn: '38.5–42', hipsCm: '121–128', hipsIn: '47.5–50.5', inseamCm: '80', inseamIn: '31.5' },
];

export default function SizeGuideModal({
    open,
    onClose,
    defaultGender = 'men',
}: SizeGuideModalProps) {
    const [gender, setGender] = useState<Gender>(defaultGender);
    const [category, setCategory] = useState<CategoryTab>('tops');
    const [unit, setUnit] = useState<Unit>('cm');

    const panelRef = useRef<HTMLDivElement>(null);
    useBodyScrollLock(open);
    useFocusTrap(panelRef, open);

    useEffect(() => {
        if (defaultGender) {
            setGender(defaultGender);
        }
    }, [defaultGender]);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    const rows = gender === 'men' 
        ? (category === 'bottoms' ? MEN_BOTTOMS : MEN_TOPS)
        : (category === 'bottoms' ? WOMEN_BOTTOMS : WOMEN_TOPS);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity animate-fade-in"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Box */}
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="size-guide-title"
                className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-none border border-line bg-paper shadow-2xl animate-scale-in overflow-hidden"
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-5 bg-paper">
                    <div className="flex items-center gap-2.5">
                        <Ruler className="h-5 w-5 text-forest" strokeWidth={1.75} />
                        <h2 id="size-guide-title" className="font-display text-xl font-bold uppercase tracking-tight text-ink">
                            EverGrove Size Guide
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close size guide"
                        className="grid h-9 w-9 place-items-center text-ink transition-colors hover:bg-surface rounded-none"
                    >
                        <X className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 overscroll-contain space-y-6">
                    {/* Controls Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
                        {/* Gender Toggle */}
                        <div className="flex rounded-none border border-line p-0.5 bg-surface/50">
                            <button
                                type="button"
                                onClick={() => setGender('men')}
                                className={cn(
                                    'px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                                    gender === 'men' ? 'bg-ink text-paper shadow-sm' : 'text-muted hover:text-ink'
                                )}
                            >
                                Men's Sizing
                            </button>
                            <button
                                type="button"
                                onClick={() => setGender('women')}
                                className={cn(
                                    'px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                                    gender === 'women' ? 'bg-ink text-paper shadow-sm' : 'text-muted hover:text-ink'
                                )}
                            >
                                Women's Sizing
                            </button>
                        </div>

                        {/* Unit Switcher */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs uppercase font-medium text-muted">Unit:</span>
                            <div className="flex rounded-none border border-line p-0.5 bg-surface/50">
                                <button
                                    type="button"
                                    onClick={() => setUnit('cm')}
                                    className={cn(
                                        'px-3 py-1 text-xs font-semibold uppercase transition-colors',
                                        unit === 'cm' ? 'bg-forest text-paper' : 'text-muted hover:text-ink'
                                    )}
                                >
                                    CM
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUnit('in')}
                                    className={cn(
                                        'px-3 py-1 text-xs font-semibold uppercase transition-colors',
                                        unit === 'in' ? 'bg-forest text-paper' : 'text-muted hover:text-ink'
                                    )}
                                >
                                    INCHES
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category Switcher */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {[
                            { id: 'tops', label: 'Tops & Sweaters' },
                            { id: 'bottoms', label: 'Pants & Bottoms' },
                            { id: 'outerwear', label: 'Outerwear & Jackets' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setCategory(tab.id as CategoryTab)}
                                className={cn(
                                    'px-3.5 py-1.5 text-xs font-medium uppercase tracking-wide border transition-all whitespace-nowrap',
                                    category === tab.id
                                        ? 'border-ink bg-ink/5 text-ink font-semibold'
                                        : 'border-transparent text-muted hover:border-line hover:text-ink'
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Measurements Table */}
                    <div className="overflow-x-auto border border-line">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-surface text-xs uppercase tracking-wider text-muted border-b border-line font-medium">
                                <tr>
                                    <th className="py-3 px-4 font-semibold text-ink">Size</th>
                                    {category !== 'bottoms' && <th className="py-3 px-4">Chest ({unit})</th>}
                                    <th className="py-3 px-4">Waist ({unit})</th>
                                    <th className="py-3 px-4">Hips ({unit})</th>
                                    {category !== 'bottoms' && <th className="py-3 px-4">Sleeve ({unit})</th>}
                                    {category === 'bottoms' && <th className="py-3 px-4">Inseam ({unit})</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line tabular-nums text-[13px]">
                                {rows.map((row) => (
                                    <tr key={row.size} className="hover:bg-surface/60 transition-colors">
                                        <td className="py-3 px-4 font-bold text-ink">{row.size}</td>
                                        {category !== 'bottoms' && (
                                            <td className="py-3 px-4 text-ink/80">{unit === 'cm' ? row.chestCm : row.chestIn}</td>
                                        )}
                                        <td className="py-3 px-4 text-ink/80">{unit === 'cm' ? row.waistCm : row.waistIn}</td>
                                        <td className="py-3 px-4 text-ink/80">{unit === 'cm' ? row.hipsCm : row.hipsIn}</td>
                                        {category !== 'bottoms' && (
                                            <td className="py-3 px-4 text-ink/80">{unit === 'cm' ? row.sleeveCm : row.sleeveIn}</td>
                                        )}
                                        {category === 'bottoms' && (
                                            <td className="py-3 px-4 text-ink/80">{unit === 'cm' ? row.inseamCm : row.inseamIn}</td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* How to Measure Section */}
                    <div className="rounded-none border border-line bg-surface/40 p-5 space-y-3">
                        <div className="flex items-center gap-2 text-ink">
                            <Info className="h-4 w-4 text-forest" strokeWidth={2} />
                            <h3 className="text-xs uppercase font-bold tracking-wider">How to Measure</h3>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted leading-relaxed">
                            <div>
                                <strong className="text-ink">1. Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal under your arms.
                            </div>
                            <div>
                                <strong className="text-ink">2. Waist:</strong> Measure around your natural waistline, where your trousers naturally sit.
                            </div>
                            <div>
                                <strong className="text-ink">3. Hips:</strong> Measure around the fullest part of your hips with feet together.
                            </div>
                            <div>
                                <strong className="text-ink">4. Inseam / Sleeve:</strong> Measure from the crotch point down to the ankle / from center back neck to wrist.
                            </div>
                        </div>
                    </div>

                    {/* Sustainable Fit Note */}
                    <div className="flex items-start gap-2.5 text-xs text-forest bg-forest/5 border border-forest/20 p-3.5">
                        <Check className="h-4 w-4 shrink-0 text-forest mt-0.5" strokeWidth={2} />
                        <p>
                            <strong>Sustainable Fit Guarantee:</strong> All EverGrove garments are pre-washed and crafted with organic cotton, hemp, and Tencel to prevent post-wash shrinkage. Free 30-day exchanges if the fit isn't perfect!
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end border-t border-line px-6 py-4 bg-surface/30">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-xs uppercase font-bold tracking-wider bg-ink text-paper hover:bg-ink/90 transition-colors"
                    >
                        Got It
                    </button>
                </div>
            </div>
        </div>
    );
}
