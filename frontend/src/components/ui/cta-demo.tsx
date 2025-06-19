import { CTASection } from "@/components/ui/cta-with-rectangle"

export function CTADemo() {
  return (
    <CTASection
      badge={{
        text: "Get started"
      }}
      title="Start Your Pure Water Journey"
      description="Experience the convenience and purity of AquaNest's premium water delivery service"
      action={{
        text: "Order Now",
        href: "/products",
        variant: "default"
      }}
      className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-blue-900/20"
    />
  )
}
