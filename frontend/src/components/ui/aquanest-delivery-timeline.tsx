"use client";

import { Droplets, Clock, Truck, CheckCircle } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const deliveryTimelineData = [
  {
    id: 1,
    title: "Choose",
    date: "Step 1",
    content: "Browse our premium water selection and choose the perfect option for your needs. From purified to alkaline, we have it all.",
    category: "Selection",
    icon: Droplets,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Schedule",
    date: "Step 2",
    content: "Schedule your delivery at your convenience. Same-day, weekly, or monthly - we deliver on your schedule.",
    category: "Scheduling",
    icon: Clock,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 3,
    title: "Deliver",
    date: "Step 3",
    content: "Our delivery team brings your premium water right to your door. Fresh, pure, and ready to enjoy.",
    category: "Delivery",
    icon: Truck,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 85,
  },
  {
    id: 4,
    title: "Enjoy",
    date: "Step 4",
    content: "Experience the pure, refreshing taste of premium water. Track your satisfaction and schedule your next delivery.",
    category: "Experience",
    icon: CheckCircle,
    relatedIds: [3],
    status: "pending" as const,
    energy: 25,
  },
];

export function AquaNestDeliveryTimeline() {
  return (
    <>
      <RadialOrbitalTimeline timelineData={deliveryTimelineData} />
    </>
  );
}

export default AquaNestDeliveryTimeline;
