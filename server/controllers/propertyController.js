const Property = require("../models/property");

exports.createProperty = async (req, res) => {
  console.log("BODY:", req.body);
console.log("USER:", req.user);
  try {
    const {
      name,
      type,
      size,
      description,
    
      city,
      state,
      address,
      street,
      landmark,
      pincode,
      lat,
      lng,
    
      amenities,
    
      images,
      video,
      brochure,
      documents,
    
      totalValue,
      totalShares,
      pricePerShare,
      expectedROI,
      duration,
    } = req.body;
    
    const property = await Property.create({
      name,
      type,
      size,
      description,
    
      location: {
        city,
        state,
        address,
        street,
        landmark,
        pincode,
        lat,
        lng,
      },
    
      amenities,
    
     
    
      totalValue: Number(totalValue),
      totalShares: Number(totalShares),
      availableShares: Number(totalShares),
      pricePerShare: Number(pricePerShare),
    
      roi: Number(expectedROI),
      duration: Number(duration),
    
      createdBy: req.user.id,
    
      status: "funding",
    });

    res.json({
      message: "Property created successfully",
      property,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
//broker

exports.getMyProperties = async (req, res) => {
    const properties = await Property.find({
      createdBy: req.user.id,
    });
  
    res.json(properties);
  };

 
//   user
exports.getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property || !property.isPublished) {
    return res.status(404).json({ message: "Property not found" });
  }

  res.json(property);
};  

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isPublished: true })
      .sort({ createdAt: -1 }); // 🔥 newest first

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  exports.updateProperty = async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
  
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
  
      const updated = await Property.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
  
      res.json({
        message: "Property updated successfully",
        property: updated,
      });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.deleteProperty = async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
  
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
  
      await property.deleteOne();
  
      res.json({
        message: "Property deleted successfully",
      });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };