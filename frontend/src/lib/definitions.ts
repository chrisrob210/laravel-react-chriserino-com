export type Navlink = {
    title: string,
    href: string,
    children?: Navlink[]
}

export type TechnologiesProps = {
    title: string,
    href: string
}

export type RepoProps = {
    title: string,
    category: string,
    technologies: Array<TechnologiesProps>,
    description: string,
    href: string,
    image: string,
    github: string
}

export type RepoCardProps = {
    repo: RepoProps,
    repoIndex: number
}

export interface Skill {
    name: string;
    icon?: string;
}

export interface Experience {
    title: string;
    skills: Skill[];
}

export interface ExperienceCardProps {
    experience: Experience;
}