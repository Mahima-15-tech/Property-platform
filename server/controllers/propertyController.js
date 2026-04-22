  const Property = require("../models/property");

  exports.createProperty = async (req, res) => {

    console.log("👉 BODY:", req.body);
    console.log("👉 FILES:", req.files);
    console.log("👉 USER:", req.user);
   
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
        highlights,
        totalValue,
        totalShares,
        pricePerShare,
        expectedROI,
        targetROI,
        rentalYield,
        appreciation,
        duration,
        tenants,
        propertyGrade,
        
        
      } = req.body;

      const imageFiles = req.files?.images || [];
  const documentFiles = req.files?.documents || [];
  const videoFiles = req.files?.video || [];
  const brochureFiles = req.files?.brochure || [];

  const imageUrls = imageFiles.map(file => file.path);

  const documentUrls = documentFiles.map(file => ({
    name: file.originalname,
    url: file.path,
  }));

  const videoUrl = videoFiles[0]?.path || "";
  const brochureUrl = brochureFiles[0]?.path || "";
    
    console.log("👉 IMAGE URLS:", imageUrls);


    const parsedHighlights = highlights ? JSON.parse(highlights) : [];
    


    
    const property = await Property.create({
      name,
      type,
      size,
      description,
    
      location: {
        city: city || "",
        state: state || "",
        address: address || "",
        street: street || "",
        landmark: landmark || "",
        pincode: pincode || "",
        lat: lat || 0,
        lng: lng || 0,
      },
    
      totalValue: Number(totalValue) || 0,
  totalShares: Number(totalShares) || 0,
  availableShares: Number(totalShares) || 0,
  pricePerShare: Number(pricePerShare) || 0,

  roi: Number(expectedROI) || 0,
  targetROI: Number(targetROI) || 0,
  rentalYield: Number(rentalYield) || 0,
  appreciation: Number(appreciation) || 0,

  duration: Number(duration) || 0,

  amenities: amenities ? JSON.parse(amenities) : [],
  highlights: parsedHighlights,

  tenants: tenants || "",
  propertyGrade: propertyGrade || "",
  
    
  media: {
    images: imageUrls,
    documents: documentUrls,
    video: videoUrl,
    brochure: brochureUrl,
  },
    
      createdBy: req.user.id,
    });

      res.json({
        message: "Property created successfully",
        property,
      });

     

    } catch (error) {
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
    try {
      const p = await Property.findById(req.params.id);

      if (!p || !p.isPublished) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json({
        id: p._id,
        name: p.name,
        category: p.category,

        images: p.media?.images || [],
video: p.media?.video,
brochure: p.media?.brochure || "",   // ✅ ADD THIS

        location: p.location,

        totalValue: p.totalValue,
        sharePrice: p.pricePerShare,
        roi: p.roi,
        targetROI: p.targetROI,

        fundedPercent: p.soldPercent,
        sharesLeft: p.availableShares,
        investors: p.investors,

        rentalYield: p.rentalYield,
        appreciation: p.appreciation,
        duration: p.duration,

        description: p.description,
        size: p.size,
        highlights: p.highlights,

        amenities: p.amenities,

        documents: p.media?.documents || [],

   

    

  tenants: p.tenants,
  propertyGrade: p.propertyGrade,

        calculator: {
          pricePerShare: p.pricePerShare,
          roi: p.roi
        }
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  exports.getRelatedProperties = async (req, res) => {
    try {
      const current = await Property.findById(req.params.id);

      if (!current) {
        return res.status(404).json({ message: "Property not found" });
      }

      let properties = await Property.find({
        _id: { $ne: req.params.id },
        type: current.type,
        isPublished: true
      }).limit(3);

      // 👉 fallback (agar same type na mile)
      if (properties.length === 0) {
        properties = await Property.find({
          _id: { $ne: req.params.id },
          isPublished: true
        }).limit(3);
      }

      res.json(properties);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
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