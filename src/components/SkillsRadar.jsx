import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const data = [
    { subject: 'AI / ML', A: 50, fullMark: 100 },
    { subject: 'Computer Vision', A: 50, fullMark: 100 },
    { subject: 'Software Dev', A: 70, fullMark: 100 },
    { subject: 'Embedded', A: 40, fullMark: 100 },
    { subject: 'Algorithms', A: 70, fullMark: 100 },
    { subject: 'DevOps', A: 40, fullMark: 100 },
];

const SkillsRadar = () => {
    return (
        <div className="w-full h-[300px] md:h-[400px] pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="var(--color-grid)" strokeOpacity={0.5} />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: 'rgb(var(--color-text))', fontSize: 13, fontWeight: '600' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="rgb(var(--color-primary))"
                        strokeWidth={3}
                        fill="rgb(var(--color-primary))"
                        fillOpacity={0.4}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SkillsRadar;
