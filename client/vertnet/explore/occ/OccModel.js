/*
 * Model for an occurrence.
 */

define([
  'Underscore',
  'Backbone'
], function (_, Backbone) {
  return Backbone.Model.extend({
    DWC_RECLEVEL: ['Type', 'Modified', 'Language', 'Rights', 'RightsHolder', 
      'AccessRights', 'BibliographicCitation', 'References', 'InstitutionID', 
      'CollectionID', 'DatasetID', 'InstitutionCode', 'CollectionCode', 
      'DatasetName', 'OwnerInstitutionCode', 'BasisOfRecord', 'InformationWithheld', 
      'DataGeneralizations', 'DynamicProperties'],

    DWC_OCC: ['OccurrenceID', 'CatalogNumber', 'OccurrenceRemarks', 'RecordNumber', 
      'RecordedBy', 'IndividualID', 'IndividualCount', 'Sex', 'LifeStage', 
      'ReproductiveCondition', 'Behavior', 'EstablishmentMeans', 'OccurrenceStatus', 
      'Preparations', 'Disposition', 'OtherCatalogNumbers', 'PreviousIdentifications', 
      'AssociatedMedia', 'AssociatedReferences', 'AssociatedOccurrences', 
      'AssociatedSequences', 'AssociatedTaxa'],

    DWC_EVENT: ['EventID', 'SamplingProtocol', 'SamplingEffort', 'EventDate', 
      'EventTime', 'StartDayOfYear', 'EndDayOfYear', 'Year', 'Month', 'Day', 
      'VerbatimEventDate', 'Habitat', 'FieldNumber', 'FieldNotes', 'EventRemarks'],

    DWC_LOCATION: ['LocationID', 'HigherGeographyID', 'HigherGeography', 
      'Continent', 'WaterBody', 'IslandGroup', 'Island', 'Country', 'CountryCode', 
      'StateProvince', 'County', 'Municipality', 'Locality', 'VerbatimLocality', 
      'VerbatimElevation', 'MinimumElevationInMeters', 'MaximumElevationInMeters', 
      'VerbatimDepth', 'MinimumDepthInMeters', 'MaximumDepthInMeters', 
      'MinimumDistanceAboveSurfaceInMeters', 'MaximumDistanceAboveSurfaceInMeters', 
      'LocationAccordingTo', 'LocationRemarks', 'VerbatimCoordinates', 
      'VerbatimLatitude', 'VerbatimLongitude', 'VerbatimCoordinateSystem', 
      'VerbatimSRS', 'DecimalLatitude', 'DecimalLongitude', 'GeodeticDatum', 
      'CoordinateUncertaintyInMeters', 'CoordinatePrecision', 
      'PointRadiusSpatialFit', 'FootprintWKT', 'FootprintSRS', 
      'FootprintSpatialFit', 'GeoreferencedBy', 'GeoreferencedDate', 
      'GeoreferenceProtocol', 'GeoreferenceSources', 
      'GeoreferenceVerificationStatus', 'GeoreferenceRemarks'],

    DWC_GEO: ['GeologicalContextID', 'EarliestEonOrLowestEonothem', 
      'LatestEonOrHighestEonothem', 'EarliestEraOrLowestErathem', 
      'LatestEraOrHighestErathem', 'EarliestPeriodOrLowestSystem', 
      'LatestPeriodOrHighestSystem', 'EarliestEpochOrLowestSeries', 
      'LatestEpochOrHighestSeries', 'EarliestAgeOrLowestStage', 
      'LatestAgeOrHighestStage', 'LowestBiostratigraphicZone', 
      'HighestBiostratigraphicZone', 'LithostratigraphicTerms', 'Group', 'Formation', 
      'Member', 'Bed'],

    DWC_ID: ['IdentificationID', 'IdentifiedBy', 'DateIdentified', 
      'IdentificationReferences', 'IdentificationVerificationStatus', 
      'IdentificationRemarks', 'IdentificationQualifier', 'TypeStatus'],

    DWC_TAXON: ['TaxonID', 'ScientificNameID', 'AcceptedNameUsageID', 
      'ParentNameUsageID', 'OriginalNameUsageID', 'NameAccordingToID', 
      'NamePublishedInID', 'TaxonConceptID', 'ScientificName', 'AcceptedNameUsage', 
      'ParentNameUsage', 'OriginalNameUsage', 'NameAccordingTo', 'NamePublishedIn', 
      'NamePublishedInYear', 'HigherClassification', 'Kingdom', 'Phylum', 'Class', 
      'Order', 'Family', 'Genus', 'Subgenus', 'SpecificEpithet', 
      'InfraspecificEpithet', 'TaxonRank', 'VerbatimTaxonRank', 
      'ScientificNameAuthorship', 'VernacularName', 'NomenclaturalCode', 
      'TaxonomicStatus', 'NomenclaturalStatus', 'TaxonRemarks'],

    DWC_ALL: function() {
      return _.union(this.DWC_RECLEVEL, this.DWC_OCC, this.DWC_EVENT, 
        this.DWC_LOCATION, this.DWC_GEO, this.DWC_ID, this.DWC_TAXON);
    },

    isMappable: function() {
      var lat = this.get('decimallatitude');
      var lon = this.get('decimallongitude');
      lat = lat ? parseFloat(lat) : null;
      lon = lon ? parseFloat(lon) : null;
      if (lat && lon) {
        return (lat <= 90 && lat >= -90) && (lon <= 180 && lon >= -180);
      } else {
        return false;
      }
    },

    loc: function() {
      return this._terms(this.DWC_LOCATION);
    },

    reclevel: function() {
      return this._terms(this.DWC_RECLEVEL);
    },

    occ: function() {
      return this._terms(this.DWC_OCC);
    }, 

    event: function() {
      return this._terms(this.DWC_EVENT);
    },

    geo: function() {
      return this._terms(this.DWC_GEO);
    },

    iden: function() {
      return this._terms(this.DWC_ID);
    },

    taxon: function() {
      return this._terms(this.DWC_TAXON);
    },

    all: function() {
      return _.extend({}, this.loc(), this.reclevel(), this.occ(), this.event(), this.geo(),
        this.iden(), this.taxon());
    },

    _terms: function(terms) {
      var results = {};
      _.map(this.attributes, _.bind(function(val, key) {
        _.filter(terms, function(term) {
          if (term.toLowerCase() === key) {
            results[term] = val;
          }
        });
      }, this));
      return results;
    }    
  });
});
