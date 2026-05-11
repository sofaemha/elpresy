

export default function Desktop({Links}: {Links: {
    label: string;
    href: string;
}[]}) {
    return (
        <nav className="hidden md:flex items-center gap-8">
          {Links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
    )
}