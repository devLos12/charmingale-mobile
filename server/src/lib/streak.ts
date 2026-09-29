import { prisma } from "@/lib/prisma";

const PH_OFFSET_MS = 8 * 60 * 60 * 1000;

// kunin yung "araw" base sa Philippine time, kahit anong timezone ang server
const getPHDateOnly = (date: Date = new Date()): Date => {
    const phTime = new Date(date.getTime() + PH_OFFSET_MS);
    return new Date(Date.UTC(phTime.getUTCFullYear(), phTime.getUTCMonth(), phTime.getUTCDate()));
};

const isSameDay = (a: Date, b: Date): boolean => {
    return getPHDateOnly(a).getTime() === getPHDateOnly(b).getTime();
};

const isYesterday = (lastDate: Date, today: Date): boolean => {
    const yesterday = new Date(getPHDateOnly(today));
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    return getPHDateOnly(lastDate).getTime() === yesterday.getTime();
};





export const updateStreak = async () => {
    const today = getPHDateOnly();

    let streak = await prisma.streak.findFirst();

    if (!streak) {
        streak = await prisma.streak.create({
            data: { count: 1, lastDate: today },
        });
        return streak;
    }

    if (streak.lastDate && isSameDay(streak.lastDate, today)) {
        return streak;
    }

    const newCount = streak.lastDate && isYesterday(streak.lastDate, today)
        ? streak.count + 1
        : 1;

    streak = await prisma.streak.update({
        where: { id: streak.id },
        data: { count: newCount, lastDate: today },
    });

    return streak;
};