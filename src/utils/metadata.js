
const formatMetadata = async(metadata) => {
    const saveFormat = {}
    console.log("METADATA =>", metadata)
    console.log("ATTRIBUTES =>", typeof metadata.attributes)

    saveFormat.name = metadata.name;
    saveFormat.description = metadata.description;
    saveFormat.project = metadata.attributes.find(o => o.trait_type === 'project').value;
    saveFormat.butcheredChain = metadata.attributes.find(o => o.trait_type === 'butcheredChain').value;
    saveFormat.butcheredContract = metadata.attributes.find(o => o.trait_type === 'butcheredContract').value;
    saveFormat.butcheredTokenId = metadata.attributes.find(o => o.trait_type === 'butcheredTokenId').value;
    saveFormat.butcheredOwner = metadata.attributes.find(o => o.trait_type === 'butcheredOwner').value;
    saveFormat.butcheredDescription = metadata.attributes.find(o => o.trait_type === 'butcheredDescription').value;
    saveFormat.butcheredName = metadata.attributes.find(o => o.trait_type === 'butcheredName').value;
    saveFormat.butcheredRoyaltyHolder = metadata.attributes.find(o => o.trait_type === 'butcheredRoyaltyHolder').value;
    saveFormat.butcheredSymbol = metadata.attributes.find(o => o.trait_type === 'butcheredSymbol').value;
    saveFormat.butcheredRoyalty = metadata.attributes.find(o => o.trait_type === 'butcheredRoyaltyAmount').value;
    saveFormat.butcherMinter = metadata.attributes.find(o => o.trait_type === 'butcherMinter').value;
    saveFormat.butcheredMetadataUrl = metadata.attributes.find(o => o.trait_type === 'butcheredMetadataUrl').value;
    saveFormat.butcheredImageUrl = metadata.attributes.find(o => o.trait_type === 'butcheredImageUrl').value;

    return saveFormat;

}

module.exports = {
    formatMetadata,
}
