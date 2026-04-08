// src/components/WritersList.tsx
"use client";

import { useState, useRef,  useEffect } from "react";
import { WORK_PAGE_QUERY, type Work, type Link, type LinkUnion } from '@/lib/queries/work';


type Props = {
  works: Work[];
};




export default function WritersList({ works }: Props) {
  const [selectedWork, setSelectedWork] = useState<string | null>(null);

  const scrollerRefs = useRef<Record<string, HTMLDivElement | null>>({});
const [hovered, setHovered] = useState<string | null>(null);



  const handleClickDirector = (name: string) => {
    if (selectedWork === name) {
      setSelectedWork(null);
    } else {
      setSelectedWork(null);
      setTimeout(() => {
        setSelectedWork(name);
        const scroller = scrollerRefs.current[name];
        if (scroller) scroller.scrollLeft = 0;
      }, 400);
    }
  };



  return (
    <>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 ,borderTop: '.5px solid #e6e6e6',width:'calc(100vW - 30px)', marginLeft:'15px',}}>
        {works.map((work) => {
          const isOpen = selectedWork === work.project;

          return (
            <div key={work.project} style={{borderBottom:'.5px solid #e6e6e6', width:'100%',paddingBlock:'5px'}}>
            <div style={{display:'flex',cursor: "pointer",}}   onClick={() => handleClickDirector(work.project)}
                            onMouseEnter={(e) => {
                            if (isOpen) return; // ← BLOCCO SE È APERTO
                            }}>
                    <p
                        className={`nameWork ${isOpen ? "nameWork--active" : ""}`}
                        style={{
                        cursor: "pointer",
                        textAlign: "left",
                        fontWeight: 500,
                        margin: 0,
                        textTransform: 'uppercase'
                        }}
                    >
                        {work.project}
                    </p>
                    <p className="workYear" style={{position:'absolute', left:'calc(33.32vW + 15px)'}}>{work.year}</p>
                    <p style={{position:'absolute', right:'15px'}}>{isOpen ? "↑" : "↓"}</p>

              </div>
              <div
                style={{
                  maxHeight: isOpen ? "60vH" : "0px",
                  overflow: "hidden",
                  transition: "max-height .8s ease",
                  marginTop: "0px",
                }}
              >
                <div
                  ref={(el) => {
                    scrollerRefs.current[work.project] = el;
                  }}
                  className="workLinkList">
               {work.links.map((link, i) => {
                       const key = `${work.project}-${i}`;
                        const isHovered = hovered === key;

                        return (
                          <div key={i}>
                            <a
                              style={{ marginBottom: '15px' , opacity: isHovered ? 1 : 0, marginLeft:isHovered ? '0px' : '-20px' , transition:'.5s'}}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                               onMouseEnter={() => setHovered(key)}
                              onMouseLeave={() => setHovered(null)}
                            >
                              <span style={{marginRight:'4px'}}> → </span>
                            </a>

                            <a
                              className="custom-link"
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onMouseEnter={() => setHovered(key)}
                              onMouseLeave={() => setHovered(null)}
                            >
                              {link.title}
                            </a>
                        <div className="textWriter" 
                        dangerouslySetInnerHTML={{ __html: link.notes?.html ?? " " }}/>
                    </div>
                    );
                
                return null;
                })}

                </div>
              </div>
            </div>
          );
        })}
      </ul>




   
    </>
  );
}
