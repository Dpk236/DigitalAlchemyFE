
export interface RoadmapItem {
  title: string;
  id: string;
}

export interface SubTopic {
  title: string;
  items: RoadmapItem[];
}

export interface RoadmapSection {
  id: string;
  mainTitle: string;
  description?: string;
  leftBranches?: SubTopic[];
  rightBranches?: SubTopic[];
  centerNote?: string;
}
