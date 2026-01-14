import React from 'react';
import SkillsRadar from './SkillsRadar';

const skillsData = {
    Hardware: ['FPGA', 'Verilog', 'Microcontrollers', 'Embedded Systems', 'PCB Design'],
    Software: ['Python', 'C', 'C++', 'Java', 'SQL', 'Flutter', 'React', 'Flask', 'OpenCV', 'TensorFlow', 'PyTorch', 'NumPy', 'Pandas'],
    Tools: ['Docker', 'Git', 'Linux', 'Matlab', 'Simulink', 'Google Cloud Platform']
};

const Skills = () => {
    return (
        <div>
            <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical <span className="text-primary">Skills</span></h2>
                <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Skills Visualization */}
                <div className="order-1 lg:order-1 bg-surface/30 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
                    <h3 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">Expertise Profile</h3>
                    <SkillsRadar />
                </div>

                {/* Skills Tags */}
                <div className="order-2 lg:order-2 grid grid-cols-1 gap-6">
                    {Object.entries(skillsData).map(([category, skills]) => (
                        <div key={category} className="bg-surface/50 rounded-2xl p-6 hover:bg-surface transition-colors border border-transparent hover:border-primary/20">
                            <h3 className="text-xl font-bold mb-4 text-center text-secondary">{category}</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-4 py-2 bg-background rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-primary/10 dark:hover:bg-primary/20 transition-all cursor-default border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Skills;
