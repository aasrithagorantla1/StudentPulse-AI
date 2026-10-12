import { ArrowUpRight, CircleDashed, Compass, type LucideIcon } from 'lucide-react';

type PagePlaceholderProps = {
  title: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  index: string;
};

export default function PagePlaceholder({
  title,
  eyebrow,
  description,
  icon: Icon,
  index,
}: PagePlaceholderProps) {
  return (
    <section className="placeholder-page" data-testid={`page-${index}`}>
      <div className="page-heading">
        <div className="page-eyebrow"><span className="eyebrow-line" />{eyebrow}</div>
        <h1 data-testid={`heading-${index}`}>{title}</h1>
        <p className="page-intro">{description}</p>
      </div>

      <div className="foundation-panel" data-testid={`placeholder-${index}`}>
        <div className="panel-topline">
          <span className="panel-kicker">PRODUCT FOUNDATION</span>
          <span className="panel-index">{index.padStart(2, '0')}</span>
        </div>
        <div className="panel-body">
          <div className="panel-symbol"><Icon size={27} strokeWidth={1.5} /></div>
          <div className="panel-copy">
            <div className="panel-status"><CircleDashed size={14} />Section placeholder</div>
            <h2>{title} is taking shape.</h2>
            <p>This section is reserved for future {title.toLowerCase()} tools. No student records or live information are shown in this foundation release.</p>
          </div>
          <div className="panel-arrow" aria-hidden="true"><ArrowUpRight size={19} /></div>
        </div>
        <div className="panel-bottomline">
          <span><Compass size={14} />Built for college support teams</span>
          <span>Foundation release</span>
        </div>
      </div>
      <p className="placeholder-caption" data-testid={`caption-${index}`}>
        <span className="caption-mark" />A focused starting point for a more connected student-success workspace.
      </p>
    </section>
  );
}
