import { cn } from "@/lib/utils";

export const BentoGrid = ({
    className,
    children,
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}) => {
    return (
        <div
            className={cn(
                "row-span-1 rounded-xl group/bento hover:shadow-soft transition duration-200 shadow-input bg-card border border-border/50 justify-between flex flex-col space-y-4 p-4",
                className
            )}
        >
            {header}
            <div className="group-hover/bento:scale-105 transition duration-200 flex flex-col items-center text-center">
                {icon}
                <div className="font-sans font-bold text-foreground mb-2 mt-4 text-lg">
                    {title}
                </div>
                <div className="font-sans font-normal text-muted-foreground text-sm leading-relaxed px-2">
                    {description}
                </div>
            </div>
        </div>
    );
};
