interface PropertyDataType {
  new_properties: {
    items: { property: PropertyIndexData; deal_id: string }[];
    count: number;
  };
  to_be_qualified_properties: {
    items: { property: PropertyIndexData; deal_id: string }[];
    count: number;
  };
  qualified_properties: {
    items: { property: PropertyIndexData; deal_id: string }[];
    count: number;
  };
  rejected_properties: {
    items: { property: PropertyIndexData; deal_id: string }[];
    count: number;
  };
  visited_properties: {
    items: { property: PropertyIndexData; deal_id: string }[];
    count: number;
  };
}
