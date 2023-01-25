export interface Data {
  name: string;
  avatar: string;
  links: Link[];
  socials: Social[];
}

export interface Link {
  href: string;
  title: string;
}

export interface Social {
  href: string;
  title: string;
}
