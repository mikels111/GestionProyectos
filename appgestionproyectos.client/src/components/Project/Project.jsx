import React, { Component, useEffect, useContext, useRef, useState } from "react";
import { useParams } from 'react-router-dom'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import { AuthRequest } from '../../Utils/Authorization';
import { Context } from '../Router/Router';
import { Notify } from '../../Utils/Notifications';
import styles from './Project.module.css'
function Project() {
    const { globalUser, setGlobalUser, globalWorkspace, setGlobalWorkspace } = useContext(Context);
    const { warn, info } = Notify();
    let { projectId } = useParams();
    const ejInstance = useRef();
    const [actualProject, setActualProject] = useState(() => {
        return projectId;
    });
    const DEFAULT_DATA = {
        "time": new Date().getTime(),
        "blocks": [
            {
                "type": "header",
                "data": {
                    "text": "data not found",
                    "level": 1
                }
            }
        ]
    }

    const [projectData, setProjectData] = useState(null);

    useEffect(() => {
        //console.log("projectid", projectId);
        setActualProject(projectId);

    }, [projectId]);

    useEffect(() => {
        //console.log("actual project", actualProject);
        if (ejInstance.current === undefined) {

            AuthRequest(`Project/getProjectData?fields=${projectId}`, 'get').
                then((res) => {
                    //console.log("project data", JSON.parse(res.data.data));
                    setProjectData(JSON.parse(res.data.data));
                    //setProjectData(DEFAULT_DATA);

                }).
                catch((err) => {
                    console.log(err);
                    let messag = "We’re having technical issues. Please try again later.";
                    warn(messag);
                    setProjectData(DEFAULT_DATA)

                });
        }
        return () => {
            ejInstance?.current?.destroy();
            ejInstance.current = undefined;
        };
    }, [actualProject]);

    useEffect(() => {
        if (projectData != null) {
            initEditor();

        }
    }, [projectData]);

    const initEditor = () => {
        //console.log("initeditor actual project", actualProject)
        //console.log("initeditor project data", projectData)
        //console.log("initeditor project id", projectId)
        const editor = new EditorJS({
            holder: 'editorjs',
            onReady: () => {
                ejInstance.current = editor;
            },
            autofocus: true,
            data: projectData,
            onChange: async () => {
                let content = await editor.saver.save();
                let projectIdStr = projectId;
                //console.log(content, "en proyecto:" + projectIdStr);
                AuthRequest(`Project/saveProjectData`, 'post', { content, projectId }).
                    then((res) => {
                        let response = res
                        //console.log("gaurdado: ", response);
                    }).
                    catch((err) => {
                        console.log(err);
                        let messag = "We’re having technical issues. Please try again later.";
                        warn(messag);
                    });
            },
            tools: {
                header: Header,
            }
        });
    };
    return (
        <div id='editorjs' className={styles['editorjs-container']} ></div>
        //<h2>Project {projectId} </h2>
    );
}

export default Project;