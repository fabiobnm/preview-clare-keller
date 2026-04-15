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
const [hoveredWork, setHoveredWork] = useState<string | null>(null);



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
      <ul style={{ listStyle: "none", padding: 0, margin: 0 ,borderTop: '.5px solid #e6e6e6',width:'calc(100vW - 30px)', marginLeft:'15px',marginBottom:'30px'}}>
       
       
      {[...works]
  .sort((a, b) => {
    const parseYear = (y: string) => {
      const str = y.toLowerCase().trim();

      const isCurrent = str.includes("current");

      // prendi tutti gli anni validi
      const matches = str.match(/\d{4}/g) || [];

      // ultimo anno valido (fine range)
      const year = matches.length ? Number(matches[matches.length - 1]) : 0;

      return { isCurrent, year };
    };

    const A = parseYear(a.year);
    const B = parseYear(b.year);

    // current sempre sopra
    if (A.isCurrent !== B.isCurrent) {
      return A.isCurrent ? -1 : 1;
    }

    // poi ordina per anno (fine range)
    return B.year - A.year;
  })
  .map((work) => {
          const isOpen = selectedWork === work.project;

          return (
            <div key={work.project} style={{borderBottom:'.5px solid #e6e6e6', width:'100%',paddingBlock:'5px', paddingTop:'7px'}}>
            <div className="bloccoWork" style={{display:'flex',cursor: "pointer", justifyContent:'space-between',
             opacity: hoveredWork && hoveredWork !== work.project ? 0.3 : 1,
             transition: 'opacity .8s'}}   
             onClick={() => handleClickDirector(work.project)}
             onMouseEnter={() => {
              if (isOpen) return;
              setHoveredWork(work.project);
            }}
            onMouseLeave={() => setHoveredWork(null)}>
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
                    <p className="workYear" style={{position:'absolute', left:'calc(49.65vW + 15px)'}}>{work.year}</p>
                    <p className="workArrow">{isOpen ? "↑" : "↓"}</p>

              </div>
              <div
                style={{
                  maxHeight: isOpen ? "100vH" : "0px",
                  overflow: "hidden",
                  transition: "max-height .8s ease",
                  marginTop: "0px",
                }}
              >
                <div className="workInfo" dangerouslySetInnerHTML={{ __html: work.info?.html ?? " " }}/>
                    
                
                <div
                  ref={(el) => {
                    scrollerRefs.current[work.project] = el;
                  }}
                  className="workLinkList">
               {work.links.map((link, i) => {
                       const key = `${work.project}-${i}`;
                        const isHovered = hovered === key;

                        return (
                          <div style={{ marginBottom: link.notes ? '30px' : '0px',}} key={i}>
                            <a
                              style={{  marginBottom: '15px' , opacity: isHovered ? 1 : 0, marginLeft:isHovered ? '0px' : '-20px' , transition:'.5s'}}
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
