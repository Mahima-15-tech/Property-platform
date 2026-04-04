const Property = require("../models/property");

exports.createProperty = async (req, res) => {
  try {
    const AuditLog = require("../models/auditLog");

    // 🔥 STEP 1: extract data
    const {
      name,
      type,
      size,
      description,
      isFeatured, // ✅ correct

      city,
      state,
      address,
      street,
      landmark,
      pincode,
      lat,
      lng,

      amenities,

      totalValue,
      totalShares,
      pricePerShare,
      expectedROI,
      duration,
    } = req.body;

    // 🔥 STEP 2: check featured limit
    if (isFeatured) {
      const count = await Property.countDocuments({ isFeatured: true });

      if (count >= 3) {
        return res.status(400).json({
          message: "Only 3 featured properties allowed",
        });
      }
    }

    // 🔥 STEP 3: create property
    const property = await Property.create({
      name,
      type,
      size,
      description,

      isFeatured: isFeatured || false, // ✅ yaha lagta hai

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

    // 🔥 STEP 4: audit log
    await AuditLog.create({
      action: "Property Created",
      user: req.user.id,
      details: property.name,
      type: "create",
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

      if (req.body.isFeatured) {
        const count = await Property.countDocuments({
          isFeatured: true,
          _id: { $ne: req.params.id },
        });
      
        if (count >= 3) {
          return res.status(400).json({
            message: "Only 3 featured properties allowed",
          });
        }
      }
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.getPropertiesList = async (req, res) => {
    const properties = await Property.find().select("_id name");
    res.json(properties);
  };

  exports.getFeaturedProperties = async (req, res) => {
    try {
      const properties = await Property.find({
        isFeatured: true,
        isPublished: true,
      })
        .sort({ createdAt: -1 })
        .limit(3);
  
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  exports.exploreProperties = async (req, res) => {
    try {
      const {
        search,
        city,
        type,
        minROI,
        maxROI,
        minPrice,
        maxPrice,
        status,
        sort = "newest",
        page = 1,
        limit = 6,
      } = req.query;
  
      let query = { isPublished: true };
  
      // 🔍 SEARCH
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { "location.city": { $regex: search, $options: "i" } },
        ];
      }
  
      // 📍 CITY FILTER
      if (city) query["location.city"] = city;
  
      // 🏢 TYPE FILTER
      if (type) query.type = type;
  
      // 📊 ROI FILTER
      if (minROI || maxROI) {
        query.roi = {};
        if (minROI) query.roi.$gte = Number(minROI);
        if (maxROI) query.roi.$lte = Number(maxROI);
      }
  
      // 💰 PRICE FILTER
      if (minPrice || maxPrice) {
        query.pricePerShare = {};
        if (minPrice) query.pricePerShare.$gte = Number(minPrice);
        if (maxPrice) query.pricePerShare.$lte = Number(maxPrice);
      }
  
      // 📌 STATUS FILTER
      if (status) query.status = status;
  
      // 🔽 SORT
      let sortOption = { createdAt: -1 }; // default newest
      if (sort === "roi") sortOption = { roi: -1 };
      if (sort === "price") sortOption = { pricePerShare: 1 };
  
      // 📄 PAGINATION
      const skip = (page - 1) * limit;
  
      const properties = await Property.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));
  
      const total = await Property.countDocuments(query);
  
      // 🎯 UI READY RESPONSE
      const formatted = properties.map((p) => ({
        id: p._id,
        name: p.name,
        city: p.location?.city,
        image: p.media?.images?.[0] || null,
        roi: p.roi,
        totalValue: p.totalValue,
        sharePrice: p.pricePerShare,
        fundedPercent: p.soldPercent,
        type: p.type,
        status: p.status,
      }));
  
      res.json({
        data: formatted,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
        },
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