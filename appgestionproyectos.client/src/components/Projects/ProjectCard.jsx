import React from "react";
import { useNavigate, NavLink } from 'react-router-dom';
function ProjectCard({ project }) {
    const navigate = useNavigate();
    return (
        <button
            className="group relative flex aspect-square w-full flex-col justify-between rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-[hsl(210,100%,56%)]/40 hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Open project ${project.name}`} onClick={(e) => {
                //e.preventDefault();
                //e.stopPropagation();
                navigate(project.route);
            }}
        >
            {/* Top: icon */}
            <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg  text-muted-foreground transition-colors group-hover:text-foreground">
                </div>
            </div>

            {/* Bottom: info */}
            <div className="flex flex-col gap-1" >
                <h5 className="truncate text-sm font-semibold text-card-foreground">
                    {project.name}
                </h5>
                <p className="truncate text-xs text-muted-foreground">
                    {project.creation_date}
                </p>
            </div>
        </button>
    )
}
export default ProjectCard;