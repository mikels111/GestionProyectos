import React, { Component, useEffect, useContext, useRef, useState } from "react";
import { useParams } from 'react-router-dom'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Checklist from '@editorjs/checklist' 
import CodeTool from '@editorjs/code';
import Table from '@editorjs/table';
import ImageTool from '@editorjs/image';
import { AuthRequest } from '../../Utils/Authorization';
import { Context } from '../Router/Router';
import { Notify } from '../../Utils/Notifications';
import styles from './Project.module.css'
function Project() {
    const { globalUser, setGlobalUser, globalWorkspace, setGlobalWorkspace } = useContext(Context);
    const { warn, info } = Notify();
    let { public_id } = useParams();
    const ejInstance = useRef();
    const [actualProject, setActualProject] = useState(() => {
        return public_id;
    });
    const ERROR_DATA = {
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
    const DEFAULT_DATA = {
        "time": new Date().getTime(),
        "blocks": [
            {
                "type": "header",
                "data": {
                    "text": "new project",
                    "level": 1
                }
            }
        ]
    }

    const [projectData, setProjectData] = useState();

    useEffect(() => {
        //console.log("projectid", projectId);
        setActualProject(public_id);

    }, [public_id]);

    useEffect(() => {
        //console.log("actual project", actualProject);
        if (ejInstance.current === undefined) {

            AuthRequest(`/api/Project/getProjectData?fields=${public_id}`, 'get').
                then((res) => {
                    if (res.data.data != null) {
                        setProjectData(JSON.parse(res.data.data));
                    }

                }).
                catch((err) => {
                    console.log(err);
                    let messag = "We�re having technical issues. Please try again later.";
                    warn(messag);
                    setProjectData(ERROR_DATA)

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
            placeholder: 'Start writing here!',
            autofocus: true,
            data: projectData,
            onChange: async () => {
                let content = await editor.saver.save();
                let projectIdStr = public_id;
                //console.log(content, "en proyecto:" + projectIdStr);
                AuthRequest(`/api/Project/saveProjectData`, 'post', { content, public_id }).
                    then((res) => {
                        let response = res
                        //console.log("gaurdado: ", response);
                    }).
                    catch((err) => {
                        console.log(err);
                        let messag = "We�re having technical issues. Please try again later.";
                        warn(messag);
                    });
            },
            tools: {
                header: Header,
                class: Checklist,
                code: CodeTool,
                table: {
                    class: Table,
                    inlineToolbar: false
                },
                image: {
                    class: ImageTool,
                    config: {
                        endpoints: {
                            byFile: 'http://localhost:5199/api/user/loginuser' // Your backend file uploader endpoint
                        }
                    }
                }
            }
        });
    };
    return (
        <div className={styles["content-wrapper"]}>
            <div id='editorjs' className={styles['editorjs-container']} ></div>
        </div>
        //<h2>Project {projectId} </h2>
    );
}

export default Project;