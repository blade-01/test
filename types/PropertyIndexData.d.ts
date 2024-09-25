interface PropertyIndexData {
  _id: string;
  owner: {
    _id: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  location: {
    type: string;
    coordinates: [number, number];
  };
  details: {
    kitchen_type: string;
    windows_type: string;
  };
  cadastral_details: {
    number: string;
    block: string;
    area: string;
    door: string;
    publication_of_the_address: false;
  };
  energy_rating: {
    consumption: string;
    emissions: string;
  };
  description: [
    {
      text: string;
      title: string;
      lang: string;
    }
  ];
  name: string;
  status: string;
  reference: string;
  price: number;
  currency: string;
  part_ownership: true;
  leasehold: true;
  new_construction: true;
  type: string;
  number_of_bedrooms: number;
  number_of_bathrooms: number;
  builded_area: number;
  plot_size: number;
  virtual_tour_url: string;
  features: {
    air_conditioning: true;
    fitted_wardrobes: false;
    lift: true;
    exterior: true;
    parking: true;
    garden: true;
    luxury_home: false;
    swimming_pool: true;
  };
  notes: string;
  display_on_website: true;
  equipment: string;
  useful_area: number;
  commission_percentage: number;
  calculate_commission_from_flag: number;
  owner_net_price: number;
  sync_price_with_commission: true;
  accept_counter_offers: true;
  transaction: string;
  land_registry_reference: string;
  floor: string;
  condition: string;
  video_platform: string;
  additional_amenities: string;
  toilets: number;
  slug: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  company: {
    _id: string;
  };
  mls: [];
  published_at: string;
  contacts: [
    {
      _id: string;
      first_name: string;
      last_name: string;
      status: string;
      owner: {
        _id: string;
      };
      lead: {
        status: string;
        source: string;
        stage: string;
      };
      property_details: {
        type: string;
        location: string[];
        number_of_bedrooms: number;
        number_of_bathrooms: number;
        size_min: number;
        size_max: number;
        price_min: number;
        price_max: number;
      };
    }
  ];
  files: [
    {
      _id: string;
      file_name: string;
      file_title: string;
      mime: string;
      sort: number;
      tags: Array<any>;
      file_identifier: number;
      cloudflare_image_id: string;
      access_type: string;
      file_type: string;
      media_url: string;
    }
  ];
  project_details: null;
  update_history: Array<any>;
  deal_count: {
    preselect: number;
    rejected_by_agent: number;
    proposed: number;
    pending: number;
    interested: number;
    rejected: number;
    approved: number;
    total: number;
  };
  deals: [
    {
      _id: string;
      name: string;
      owner: {
        _id: string;
      };
      property_status: string;
      status: string;
      deal_value: number;
    }
  ];
  deal_id: string;
  portal_users_favourite: boolean;
  portal_user_property: {
    _id: string;
    property_id: string;
    portaluser_id: string;
    score: number;
    visited_date: null;
    created_at: string;
    updated_at: string;
    company: {
      _id: string;
    };
  };
}
