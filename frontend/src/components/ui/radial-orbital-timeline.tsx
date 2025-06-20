"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [viewMode, setViewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };
  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 250;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-white bg-blue-600 border-blue-400 dark:bg-blue-700 dark:border-blue-500";
      case "in-progress":
        return "text-blue-900 bg-blue-100 border-blue-300 dark:text-blue-100 dark:bg-blue-800 dark:border-blue-600";
      case "pending":
        return "text-gray-600 bg-gray-100 border-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600";
      default:
        return "text-gray-600 bg-gray-100 border-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600";
    }
  };

  return (    <div
      className="w-full h-[700px] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-blue-900/20 overflow-hidden rounded-2xl"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-700 animate-pulse flex items-center justify-center z-10 shadow-lg">
            <div className="absolute w-32 h-32 rounded-full border border-blue-300/30 dark:border-blue-400/30 animate-ping opacity-70"></div>
            <div
              className="absolute w-36 h-36 rounded-full border border-blue-200/20 dark:border-blue-300/20 animate-ping opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-blue-100/90 backdrop-blur-md"></div>
          </div>          <div className="absolute w-[550px] h-[550px] rounded-full border-2 border-blue-300/60 dark:border-blue-400/40"></div>
          <div className="absolute w-[480px] h-[480px] rounded-full border border-blue-400/50 dark:border-blue-500/30"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full -inset-1 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}                  style={{
                    background: `radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%)`,
                    width: `${item.energy * 0.7 + 60}px`,
                    height: `${item.energy * 0.7 + 60}px`,
                    left: `-${(item.energy * 0.7 + 60 - 80) / 2}px`,
                    top: `-${(item.energy * 0.7 + 60 - 80) / 2}px`,
                  }}
                ></div>                <div
                  className={`
                  w-20 h-20 rounded-full flex items-center justify-center
                  ${
                    isExpanded
                      ? "bg-blue-600 text-white dark:bg-blue-700"
                      : isRelated
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300"
                      : "bg-white text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                  }
                  border-2 
                  ${
                    isExpanded
                      ? "border-blue-400 shadow-lg shadow-blue-500/30 dark:border-blue-500"
                      : isRelated
                      ? "border-blue-300 animate-pulse dark:border-blue-600"
                      : "border-blue-200 dark:border-blue-700"
                  }
                  transition-all duration-300 transform
                  ${isExpanded ? "scale-125" : "hover:scale-110"}
                `}
                >
                  <Icon size={32} />
                </div>                <div
                  className={`
                  absolute top-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap
                  text-sm font-semibold tracking-wider
                  transition-all duration-300
                  ${isExpanded ? "text-gray-900 dark:text-white scale-110" : "text-gray-700 dark:text-gray-300"}
                `}
                >
                  {item.title}
                </div>                {isExpanded && (
                  <Card className="absolute top-28 left-1/2 -translate-x-1/2 w-72 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border-blue-200 dark:border-slate-600 shadow-xl shadow-blue-500/10 dark:shadow-blue-400/10 overflow-visible">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-blue-300 dark:bg-blue-600"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge
                          className={`px-2 text-xs ${getStatusStyles(
                            item.status
                          )}`}
                        >
                          {item.status === "completed"
                            ? "COMPLETE"
                            : item.status === "in-progress"
                            ? "IN PROGRESS"
                            : "PENDING"}
                        </Badge>
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="text-sm mt-2 text-gray-900 dark:text-white">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-gray-600 dark:text-gray-300">
                      <p>{item.content}</p>

                      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center text-gray-600 dark:text-gray-400">
                            <Zap size={10} className="mr-1" />
                            Progress
                          </span>
                          <span className="font-mono text-blue-600 dark:text-blue-400">{item.energy}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 transition-all duration-500"
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center mb-2">
                            <Link size={10} className="text-gray-500 dark:text-gray-400 mr-1" />
                            <h4 className="text-xs uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
                              Next Steps
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (i) => i.id === relatedId
                              );
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-xs rounded border-blue-200 dark:border-blue-700 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight
                                    size={8}
                                    className="ml-1 text-blue-500 dark:text-blue-400"
                                  />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
