
const formatMetadata = async(metadata) => {
    const saveFormat = {}
    console.log("METADATA =>", metadata)
    console.log("ATTRIBUTES =>", typeof metadata[0].attributes)

    saveFormat.name = metadata[0].name;
    saveFormat.description = metadata[0].description;
    saveFormat.project = metadata[0].attributes.find(o => o.trait_type === 'project').value;
    saveFormat.butcheredChain = metadata[0].attributes.find(o => o.trait_type === 'butcheredChain').value;
    saveFormat.butcheredContract = metadata[0].attributes.find(o => o.trait_type === 'butcheredContract').value;
    saveFormat.butcheredTokenId = metadata[0].attributes.find(o => o.trait_type === 'butcheredTokenId').value;
    saveFormat.butcheredOwner = metadata[0].attributes.find(o => o.trait_type === 'butcheredOwner').value;
    saveFormat.butcheredProject = metadata[0].attributes.find(o => o.trait_type === 'butcheredProject').value;
    saveFormat.butcheredName = metadata[0].attributes.find(o => o.trait_type === 'butcheredName').value;
    saveFormat.butcheredRoyaltyHolder = metadata[0].attributes.find(o => o.trait_type === 'butcheredRoyaltyHolder').value;
    saveFormat.butcheredSymbol = metadata[0].attributes.find(o => o.trait_type === 'butcheredSymbol').value;
    saveFormat.butcheredRoyalty = metadata[0].attributes.find(o => o.trait_type === 'butcheredRoyalty').value;
    saveFormat.butcherMinter = metadata[0].attributes.find(o => o.trait_type === 'butcherMinter').value;
    saveFormat.butcheredMetadataUrl = metadata[0].attributes.find(o => o.trait_type === 'butcheredMetadataUrl').value;
    saveFormat.butcheredImageUrl = metadata[0].attributes.find(o => o.trait_type === 'butcheredImageUrl').value;

    return saveFormat;

}

module.exports = {
    formatMetadata,
}
