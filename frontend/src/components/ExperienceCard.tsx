import { ExperienceCardProps, Skill } from "../lib/definitions";
// import Image from "next/image";

export default function ExperienceCard({ experience }: ExperienceCardProps) {
    return (
        <div key={`experience-category-${experience.title}`} className='grid grid-cols-1 items-stretch p-3 border-[1px] rounded-lg border-white/20 bg-white/40 backdrop-blur-sm'>
            <div className="flex flex-col items-center text-left">
                <div className="font-bold">{experience.title}</div>
                <div className="flex flex-col gap-2">
                    {experience && experience?.skills?.map((skill: Skill, skillIndex: number) => (
                        <div
                            key={`experience-category-${experience.title}-skill-${skillIndex}`}
                            className="flex items-center gap-2"
                        >
                            {skill?.icon ? <img
                                src={skill?.icon}
                                //src={skill?.icon} 
                                alt={skill.name}
                                width={16}
                                height={16} /> : <div className="w-[16px] h-[16px]" />}
                            <span className="text-sm">{skill.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}