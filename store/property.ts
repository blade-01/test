import ApiRoutes from "~/constant/ApiRoutes";

export const usePropertyStore = defineStore("PropertyStore", () => {
  const properties = ref<PropertyDataType>();

  const favorites = ref<PropertyIndexData[]>([]);

  const property = ref<PropertyIndexData | null>(null);

  const propertyList = ref<PropertyIndexData[]>([]);

  const appointment = ref<any>();

  // async function getPropertyList() {
  //   try {
  //     const [new_properties, to_be_qualified_properties, qualified_properties] =
  //       await Promise.all<PropertyResponse<any>>([
  //         useFetchApi().get(
  //           `${ApiRoutes.properties.get}?category_filter=new_properties`
  //         ),
  //         useFetchApi().get(
  //           `${ApiRoutes.properties.get}?category_filter=to_be_qualified_properties`
  //         ),
  //         useFetchApi().get(
  //           `${ApiRoutes.properties.get}?category_filter=qualified_properties`
  //         )
  //       ]);

  //     properties.value = {
  //       new_properties: new_properties.data.properties.new_properties.items.map(
  //         (item: any) => {
  //           return {
  //             ...item.property,
  //             deal_id: item.deal_id
  //           };
  //         }
  //       ),
  //       to_be_qualified_properties:
  //         to_be_qualified_properties.data.properties.to_be_qualified_properties.items.map(
  //           (item: any) => {
  //             return {
  //               ...item.property,
  //               deal_id: item.deal_id
  //             };
  //           }
  //         ),
  //       qualified_properties:
  //         qualified_properties.data.properties.qualified_properties.items.map(
  //           (item: any) => {
  //             return {
  //               ...item.property,
  //               deal_id: item.deal_id
  //             };
  //           }
  //         )
  //     };
  //   } catch (error) {
  //     console.error("Error fetching name", error);
  //   }
  // }

  async function getPropertyByStatus(status: string) {
    try {
      const { data } = await useFetchApi().get<
        PropertyResponse<PropertyIndexData>
      >(`${ApiRoutes.properties.get}?category_filter=${status}`);
      propertyList.value = data.properties[status].items.map((item: any) => {
        return {
          ...item.property,
          deal_id: item.deal_id
        };
      });
    } catch (error) {
      console.error("Error fetching name", error);
    }
  }

  async function getProperties() {
    try {
      const { data } = await useFetchApi().get(ApiRoutes.properties.get);
      properties.value = data?.properties;
      appointment.value = data.appointment;
    } catch (error) {
      console.error("Error fetching name", error);
    }
  }

  async function getPropertyDetails(values: PropertyIndexData) {
    try {
      const { data } = await useFetchApi().get(
        ApiRoutes.properties.read(values._id)
      );
      property.value = { ...data, deal_id: values.deal_id };
    } catch (error) {
      console.error("Error fetching name", error);
    }
  }

  async function getFavoriteProperties() {
    try {
      const { data } = await useFetchApi().get(ApiRoutes.properties.favorite);
      favorites.value = data;
    } catch (error) {
      console.error("Error fetching name", error);
    }
  }

  return {
    properties,
    property,
    propertyList,
    appointment,
    favorites,
    getPropertyByStatus,
    getPropertyDetails,
    getProperties,
    getFavoriteProperties
  };
});
