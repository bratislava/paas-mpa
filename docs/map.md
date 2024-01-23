# MapBox

Link to the official documentation: [Getting started](https://github.com/rnmapbox/maps/blob/main/docs/GettingStarted.md)

The React Native version of MapBox is different to the version used in the browser. The code from the browser can't be directly reused but can be used as a basis and rewritten into a version supported by React Native MapBox.

## Layers

There are many different layer types, we use 3 of them:

- [`SymbolLayer`](https://github.com/rnmapbox/maps/blob/main/docs/SymbolLayer.md) - for displaying PNG and JPEG images
- [`LineLayer`](https://github.com/rnmapbox/maps/blob/main/docs/LineLayer.md) - for displaying lines
- [`FillLayer`](https://github.com/rnmapbox/maps/blob/main/docs/FillLayer.md) - for displaying filled shapes, like polygons

There must always be a `ShapeSource` around the layers. This is where the data about the displayed shapes
comes from. One `ShapeSource` can have multiple layers that use the same dataset. In contrary to the browser version, the zones and their borders can't be displayed in one layer. We use a `FillLayer` for the zones themselves and a `LineLayer` for the borders.

### Style

The attributes names use camelCase instead of a kebab-case used in the browser version. The available style properties can be found on the docs page of each layer under the `#styles` section, e.g. [`FillLayer`](https://github.com/rnmapbox/maps/blob/main/docs/FillLayer.md#styles). There are also [Style Functions](https://github.com/rnmapbox/maps/blob/main/docs/StyleSheet.md#style-functions) available which can be used to calculate value of a styled property. We use an interpolation function based on zoom to resize the map markers. We also use `['get', 'point_count_abbreviated']` to display the number of markers that are contained in a cluster.

### Markers

```js filename="MapMarkers.tsx"
;<Images
  images={{
    [MapPointIconEnum.parkomat]: ParkomatImage,
    [MapPointIconEnum.garage]: GarageImage,
    [MapPointIconEnum.branch]: SellingPointImage,
    [MapPointIconEnum.partner]: SellingPointImage,
    [MapPointIconEnum.pPlusR]: PPLusRImage,
    [MapPointIconEnum.parkingLot]: ParkingImage,
    clusterCircle: ClusterCircleImage,
  }}
/>
{
  markersDataByKind?.map(([icon, shape]) => (
    <ShapeSource
      id={`${icon}MarkersSource`}
      shape={shape}
      clusterRadius={50}
      clusterMaxZoomLevel={14}
      cluster
      onPress={handlePointPress}
      key={icon}
    >
      <SymbolLayer
        id={`${icon}MarkersSymbol`}
        style={markersStyles.pin}
        filter={['!has', 'point_count']}
      />
      <SymbolLayer
        id={`${icon}MarkersCluster`}
        style={{ ...markersStyles.sellingPointCluster, iconImage: icon }}
        filter={['has', 'point_count']}
      />
      <SymbolLayer
        id={`${icon}MarkersClusterCount`}
        style={markersStyles.clusterCount}
        filter={['has', 'point_count']}
      />
    </ShapeSource>
  ))
}
```

This is how we handle the displaying of the map markers. At the top, we import the images into the map so that we can then reference them in the `styles`. There are 3 layers for each marker kind so that the clusters are build correctly and only markers of the same kind get clustered together. The first `SymbolLayer` displays the markers, the second the cluster icons and third the count of markers in a cluster. I have not found a way to merge the cluster icons with the cluster count and keep the stylability of the makers' count. The cluster nodes contain only a very small amount of information but most importantly the `point_count`. They do not contain the original attributes from the makers' data so the `iconImage` has to be set manually.

### Zones

All zones use the same `FillLayer` and the different color is achieved using the `styles`. The `LineLayer`s are divided into two because the style property `lineDasharray` does not support the Style Functions necessary to create a dependency on the feature attributes, in this case the `status` of the zone.

The layers are rendered in the order in which the `Layer` components are rendered, there are no z-indexes. This means that normally the layers that appear later in the code get rendered on the top. If a layer is unmounted due to e.g. an unfullfilled condition and remounted, it gets rendered on the top! That is why we render the layer with the selected zone after other zones, but we do not unmount it or else it would be rendered over the map markers.

## Camera

The handling of the is done by the `Camera` component placed in the `Map`. We use two `Camera`s to account for two states:

- user is within the city and has location services allowed and turned on -> zoom to user's location
- other -> display centered unzoomed Bratislava

This could be most probably unified into one `Camera` with a more complicated state management. The cameras have not been tested much, since it is not clearly set how they should behave.

The changing of camera state does not work through its `ref` but rather through changing the passed props and the camera updates to these changes. That is how we "fly" the camera to another point or adjust the zoom.
