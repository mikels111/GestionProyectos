import React, { useState, useContext, useEffect, useRef } from "react"
import { Context } from '../Router/Router';
import ProjectCard from "./ProjectCard"
import Button from 'react-bootstrap/Button';

function ProjectsGrid() {
    const projectsRef = useRef(null);
    const [query, setQuery] = useState("");
    const { globalUserProjects } = useContext(Context);

    //let filtered = projectsRef.current.value;
    let filtered = [];
    filtered = globalUserProjects.filter(
        (p) => p.name.toLowerCase().includes(query.toLowerCase())
    )
    useEffect(() => {
        if (globalUserProjects.length > 0) {
            globalUserProjects.map((project) => {
                console.log(project);
            })
            console.log(globalUserProjects);
        }

    }, [globalUserProjects]);

    return (
        <section style={{ margin: '60px' }} className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div style={{display:'flex', flexDirection:'row', flexWrap:'wrap',gap:'15px'}}>
                        <h1 style={{margin: 0,fontSize:'2rem', fontWeight:700}}>
                            Projects
                        </h1>
                        <Button variant="primary">Nuevo</Button>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {filtered.length} projects across your workspaces
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        {/*<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />*/}
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search projects..."
                            className="h-9 w-full rounded-lg border border-border pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {filtered.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-sm text-muted-foreground">
                        No projects match your search.
                    </p>
                </div>
            )}
        </section>
    )
}
export default ProjectsGrid;