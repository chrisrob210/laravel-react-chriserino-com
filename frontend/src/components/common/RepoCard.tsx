// import Link from "next/link"
// import Image from "next/image"
import { Link } from "react-router-dom";
import { RepoCardProps, RepoProps } from "../../lib/definitions"

// export default function RepoCard({ repo, repoIndex }: RepoCardProps) {
//     return (
//         // <div key={`repo-${repoIndex}`} className="flex flex-col justify-between gap-3 w-auto px-6 py-4 border-[1px] rounded-lg border-white/20 shadow-md shadow-gray-500/50 bg-white/40 backdrop-blur-sm">
//         <div key={`repo-${repoIndex}`} className="flex flex-col justify-between gap-3 w-auto px-6 py-4 border-[1px] rounded-lg border-white/20 shadow-md shadow-gray-500/50 bg-white/40 backdrop-blur-sm h-full min-h-[400px]">
//             <div className="text-lg font-bold text-center">{repo.title}</div>
//             <div className="text-sm font-semibold flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-center text-center">
//                 {/* <span className="sm:mr-2">Tech:</span> */}
//                 <span className="text-center sm:text-left">Tech:</span>
//                 <ul className="flex flex-wrap justify-center gap-2 sm:justify-start">
//                     {/* <li key={`repo-tech-${repoIndex}`}>Tech:</li> */}
//                     {repo?.technologies?.map((tech: any, techIndex: number) => (
//                         <li key={`repo-tech-${repoIndex}-${techIndex}`}>
//                             {/* <Link key={`tech-link-${repoIndex}-${techIndex}`} href={tech?.href} target='_blank' rel="noopener noreferrer" className="text-black bg-gray-100 px-2 py-1 rounded-md hover:text-indigo-500 hover:bg-white whitespace-nowrap">{tech.title}</Link> */}
//                             <Link key={`tech-link-${repoIndex}-${techIndex}`} href={tech?.href} target='_blank' rel="noopener noreferrer" className="text-black bg-gray-100 px-2 py-1 rounded-md border border-gray-300 hover:text-sky-700 hover:bg-white whitespace-nowrap">{tech.title}</Link>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//             <div className='flex flex-row justify-center'><Image src={repo.image} alt={repo.title} width={550} height={128} className='object-cover rounded-lg' /></div>
//             <div>
//                 <div className="">{repo.description}</div>
//                 <div className="grid grid-cols-2 gap-3">
//                     <Link href={repo?.href} className='flex-1 rounded-md px-2 py-1 text-center whitespace-nowrap text-slate-100 bg-slate-500 hover:bg-slate-400'>View</Link>
//                     <Link href={repo?.github} className='flex-1 rounded-md px-2 py-1 text-center whitespace-nowrap text-slate-100 bg-slate-500 hover:bg-slate-400'>Github Repo</Link>
//                 </div>
//             </div>
//         </div>
//     )
// }

export default function RepoCard({ repo, repoIndex }: RepoCardProps) {
    return (
        <div
            key={`repo-${repoIndex}`}
            className="flex flex-col justify-between gap-3 w-auto px-6 py-4 border-[1px] rounded-lg border-white/20 shadow-md shadow-gray-500/50 bg-white/40 backdrop-blur-sm h-full"
        >
            {/* Title + Tech */}
            <div>
                {/* Title + Category*/}
                <div className="flex justify-center">
                    <div className="text-lg font-bold text-center whitespace-nowrap mr-1 sm:mb-0 md:mb-1">{repo.title}</div> <div className="text-lg font-bold text-center whitespace-nowrap sm:mb-0 md:mb-1">(<span className="text-base font-semibold italic">{repo.category}</span>)</div>
                </div>
                {/* Technologies */}
                <div className="text-sm font-semibold flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-center text-center">
                    {/* <span className="text-left sm:text-left">Tech:</span> */}
                    <ul className="flex flex-wrap sm:justify-start md:justify-center gap-2 ">
                        {repo?.technologies?.map((tech: any, techIndex: number) => (
                            <li key={`repo-tech-${repoIndex}-${techIndex}`}>
                                <Link
                                    key={`tech-link-${repoIndex}-${techIndex}`}
                                    to={tech?.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-black bg-gray-100 px-2 py-1 rounded-md border border-gray-300 hover:text-sky-700 hover:bg-white whitespace-nowrap"
                                >
                                    {tech.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Image */}
            <div className="flex justify-center">
                <Link
                    to={repo?.href}
                >
                    <img
                        src={repo.image}
                        alt={repo.title}
                        width={550}
                        height={128}
                        className="object-cover rounded-lg ring-[1px] ring-slate-400/25 shadow-sm"
                    />
                </Link>
            </div>

            {/* Description + Buttons */}
            <div className="flex flex-col justify-between h-full">
                <div className="mb-2">{repo.description}</div>
                <div className={repo?.href !== '' ? "grid grid-cols-2 gap-3 mt-auto" : "flex"}>
                    {repo?.href !== '' && <Link
                        to={repo?.href}
                        className="flex-1 rounded-md px-2 py-1 text-center whitespace-nowrap text-slate-100 bg-slate-500 hover:bg-slate-400"
                    >
                        View
                    </Link>}
                    <Link
                        to={repo?.github}
                        className="flex-1 rounded-md px-2 py-1 text-center whitespace-nowrap text-slate-100 bg-slate-500 hover:bg-slate-400"
                    >
                        Github Repo
                    </Link>
                </div>
            </div>
        </div>
    );
}
