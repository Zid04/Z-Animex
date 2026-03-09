type Props = {
    maxLength: number;
    currentLength: number;
    label?: string;
};

export function CharacterCounter({ maxLength, currentLength, label = 'Caractères' }: Props) {
    const percentage = (currentLength / maxLength) * 100;
    const isWarning = currentLength > maxLength * 0.8;
    const isExceeded = currentLength > maxLength;

    return (
        <div className="flex items-center gap-2 justify-between text-xs">
            <span className={`${isExceeded ? 'text-destructive font-semibold' : isWarning ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                {currentLength} / {maxLength} {label}
            </span>
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all ${
                        isExceeded
                            ? 'bg-destructive'
                            : isWarning
                                ? 'bg-yellow-500'
                                : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
}
