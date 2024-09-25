interface StatsIndexData {
  appointment: {
    totalCount: number;
  };
  properties: {
    new_properties: {
      items: Array<any>;
      count: number;
    };
    to_be_qualified_properties: {
      items: Array<any>;
      count: number;
    };
    qualified_properties: {
      items: Array<any>;
      count: number;
    };
    rejected_properties: {
      items: Array<any>;
      count: number;
    };
    visited_properties: {
      items: Array<any>;
      count: number;
    };
  };
}
