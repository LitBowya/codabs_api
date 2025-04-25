import TeamMember from "../models/Team.js";
import { uploadTeamMemberImage } from "../utils/cloudinary.js"; // Assuming cloudinary utility is available

export const createTeamMember = async (req, res) => {
  try {
    const { name, position, roles, bio, image, socialLinks } = req.body;

    if (!name || !position || !roles || !bio || !image) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields (name, position, roles, bio, image) must be provided.",
      });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadTeamMemberImage(image);

    const teamMember = new TeamMember({
      name,
      position,
      roles,
      bio,
      image: imageUrl, // URL of the uploaded image
      socialLinks,
    });

    await teamMember.save();

    res.status(201).json({
      success: true,
      message: "Team member added successfully",
      teamMember,
    });
  } catch (error) {
    console.error("Error creating team member:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create team member",
      error: error.message,
    });
  }
};

export const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find();

    if (!teamMembers) {
      res.status(404).json({
        success: false,
        message: "No team member found",
      });
    }

    res.status(200).json({
      success: true,
      teamMembers,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch team members",
      error: error.message,
    });
  }
};

export const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await TeamMember.findById(id);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    res.status(200).json({
      success: true,
      teamMember,
    });
  } catch (error) {
    console.error("Error fetching team member:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch team member",
      error: error.message,
    });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, roles, bio, socialLinks, image, isActive } =
      req.body;

    // Find the existing team member
    const teamMember = await TeamMember.findById(id);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    // Upload new image if provided
    if (image) {
      teamMember.image = await uploadTeamMemberImage(image); // Update image URL
    }

    if (typeof isActive !== "undefined") {
      teamMember.isActive = isActive;
    }

    // Update fields
    teamMember.name = name || teamMember.name;
    teamMember.position = position || teamMember.position;
    teamMember.roles = roles || teamMember.roles;
    teamMember.bio = bio || teamMember.bio;
    teamMember.socialLinks = socialLinks || teamMember.socialLinks;

    await teamMember.save();

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      teamMember,
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update team member",
      error: error.message,
    });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the team member
    const teamMember = await TeamMember.findByIdAndDelete(id);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete team member",
      error: error.message,
    });
  }
};
