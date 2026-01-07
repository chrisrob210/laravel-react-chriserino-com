import React from 'react'
import ExperienceCard from '../ExperienceCard'
import RepoCard from '../common/RepoCard'
import { Experience } from '../../lib/definitions'
import { experience } from '../../constants/experience'
import { repos } from '../../constants/repos'
export default function Portfolio() {
    const avatar = '/images/me.jpg'
    return (
        <div className="flex flex-row justify-center pt-3 min-h-screen bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400  text-slate-800">
            <div className="flex flex-col items-center gap-y-10">
                {/* <h1 className="text-lg font-bold text-center mb-3">Portfolio</h1> */}

                {/* Picture & Info */}
                <div className='flex flex-col gap-4'>
                    {/* TODO: Replace <Image> with correct way in vanilla React*/}
                    <img
                        src={avatar}
                        alt="avatar"
                        width={128}
                        height={128}
                        className='rounded-full' style={{
                            width: "128px",
                            height: 'auto',
                            boxShadow: '0 0 7px rgb(0,0,0,0.2)'
                        }} />
                </div>

                <div>
                    <div className="text-center">
                        <p className="text-2xl font-bold mb-3">Hello! I&apos;m Chris</p>
                    </div>

                    <div className="text-lg font-bold space-y-1 w-full max-w-xl mx-auto px-4">
                        <div className="text-center sm:text-left">Full Stack at heart,</div>
                        <div className="text-center sm:text-right">API-driven by nature.</div>
                    </div>
                </div>

                {/* Experience */}
                <div className="w-full sm:w-3/4">
                    <div className='text-center text-xl font-bold mb-2'>Experience</div>
                    <div className={`grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
                        {experience.map((exp: Experience, expIndex: number) => (
                            <ExperienceCard key={`experience-card-${expIndex}`} experience={exp} />
                        ))}
                    </div>
                </div>


                {/* Git Repos */}
                <div className="grid grid-cols-1  sm:w-3/4 md:grid-cols-2 gap-4 mx-auto items-stretch">
                    {repos.map((repo: any, repoIndex: number) => (
                        // <div key={`repo-${repoIndex}`} className="flex flex-col justify-between gap-3 w-auto px-6 py-4 bg-gray-300 border-[1px] rounded-lg border-slate-100 shadow-md shadow-gray-500">
                        //     <div className="text-lg font-bold text-center">{repo.title}</div>
                        //     <div className="flex flex-row justify-center text-center text-sm font-semibold">
                        //         <ul className="flex flex-row gap-3 px-2 py-1 justify-center">
                        //             <li key={`repo-tech-${repoIndex}`}>Tech:</li>
                        //             {repo?.technologies?.map((tech: any, techIndex: number) => (
                        //                 <li key={`repo-tech-${repoIndex}-${techIndex}`}>
                        //                     <Link key={`tech-link-${repoIndex}-${techIndex}`} href={tech.href} target='_blank' rel="noopener noreferrer" className="text-black bg-gray-100 px-2 py-1 rounded-md hover:text-indigo-500 hover:bg-white">{tech.title}</Link>
                        //                 </li>
                        //             ))}
                        //         </ul>
                        //     </div>
                        //     <div className='flex flex-row justify-center'><Image src={repo.image} alt="" width={256} height={128} className='rounded-lg' style={{ width: "768px", height: '128px' }} /></div>
                        //     <div className="">{repo.description}</div>
                        //     <div className="flex flex-row justify-between">
                        //         <Link href={repo.href} className='w-1/3 border-0 rounded-md p-1 text-center text-slate-100 bg-slate-500 hover:bg-slate-400'>View</Link>
                        //         <Link href={repo.github} className='w-1/3 border-0 rounded-md p-1 text-center text-slate-100 bg-slate-500 hover:bg-slate-400'>Github Repo</Link>
                        //     </div>
                        // </div>
                        <RepoCard key={`repo-card-${repoIndex}`} repo={repo} repoIndex={repoIndex} />
                    ))}
                </div>
            </div>
        </div>
    )
}
