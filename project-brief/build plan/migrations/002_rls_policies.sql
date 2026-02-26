-- ============================================
-- NORTIER CUPBOARDS — Migration 002
-- Row Level Security policies + indexes + triggers
-- ============================================

-- ==================
-- HELPER FUNCTION
-- ==================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ==================
-- AUTO-UPDATE TRIGGER
-- ==================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_site_settings
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_site_content
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==================
-- INDEXES
-- ==================

CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_project_images_sort_order ON project_images(project_id, sort_order);
CREATE INDEX idx_projects_active_featured ON projects(is_active, is_featured, sort_order);
CREATE INDEX idx_projects_active_room ON projects(is_active, room_type, sort_order);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status, created_at DESC);
CREATE INDEX idx_services_active ON services(is_active, sort_order);
CREATE INDEX idx_nav_links_active ON nav_links(is_active, sort_order);
CREATE INDEX idx_footer_links_active ON footer_links(is_active, column_name, sort_order);
CREATE INDEX idx_site_content_page ON site_content(page, section);

-- ==================
-- ENABLE RLS
-- ==================

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_stats ENABLE ROW LEVEL SECURITY;

-- ==================
-- PUBLIC READ POLICIES
-- ==================

CREATE POLICY "Public read site_settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Public read nav_links"
  ON nav_links FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public read footer_links"
  ON footer_links FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public read site_content"
  ON site_content FOR SELECT
  USING (true);

CREATE POLICY "Public read services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public read projects"
  ON projects FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public read project_images"
  ON project_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_images.project_id
      AND is_active = true
    )
  );

CREATE POLICY "Public read trust_stats"
  ON trust_stats FOR SELECT
  USING (true);

-- ==================
-- PUBLIC INSERT — contact form only
-- ==================

CREATE POLICY "Public insert contact"
  ON contact_submissions FOR INSERT
  WITH CHECK (
    -- Basic validation: name must be present
    name IS NOT NULL AND length(trim(name)) >= 2
    -- Source must be 'website' (prevent spoofing other sources)
    AND (source IS NULL OR source = 'website')
    -- Status must be 'new' (prevent setting own status)
    AND (status IS NULL OR status = 'new')
  );

-- ==================
-- ADMIN POLICIES (SELECT)
-- ==================

CREATE POLICY "Admin select site_settings" ON site_settings FOR SELECT USING (is_admin());
CREATE POLICY "Admin select nav_links" ON nav_links FOR SELECT USING (is_admin());
CREATE POLICY "Admin select footer_links" ON footer_links FOR SELECT USING (is_admin());
CREATE POLICY "Admin select site_content" ON site_content FOR SELECT USING (is_admin());
CREATE POLICY "Admin select services" ON services FOR SELECT USING (is_admin());
CREATE POLICY "Admin select projects" ON projects FOR SELECT USING (is_admin());
CREATE POLICY "Admin select project_images" ON project_images FOR SELECT USING (is_admin());
CREATE POLICY "Admin select contact_submissions" ON contact_submissions FOR SELECT USING (is_admin());
CREATE POLICY "Admin select trust_stats" ON trust_stats FOR SELECT USING (is_admin());

-- ==================
-- ADMIN POLICIES (INSERT)
-- ==================

CREATE POLICY "Admin insert nav_links" ON nav_links FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin insert footer_links" ON footer_links FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin insert site_content" ON site_content FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin insert services" ON services FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin insert projects" ON projects FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin insert project_images" ON project_images FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin insert trust_stats" ON trust_stats FOR INSERT WITH CHECK (is_admin());

-- ==================
-- ADMIN POLICIES (UPDATE)
-- ==================

CREATE POLICY "Admin update site_settings" ON site_settings FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin update nav_links" ON nav_links FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin update footer_links" ON footer_links FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin update site_content" ON site_content FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin update services" ON services FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin update projects" ON projects FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin update project_images" ON project_images FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin update contact_submissions" ON contact_submissions FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin update trust_stats" ON trust_stats FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- ==================
-- ADMIN POLICIES (DELETE)
-- ==================

CREATE POLICY "Admin delete nav_links" ON nav_links FOR DELETE USING (is_admin());
CREATE POLICY "Admin delete footer_links" ON footer_links FOR DELETE USING (is_admin());
CREATE POLICY "Admin delete site_content" ON site_content FOR DELETE USING (is_admin());
CREATE POLICY "Admin delete services" ON services FOR DELETE USING (is_admin());
CREATE POLICY "Admin delete projects" ON projects FOR DELETE USING (is_admin());
CREATE POLICY "Admin delete project_images" ON project_images FOR DELETE USING (is_admin());
CREATE POLICY "Admin delete contact_submissions" ON contact_submissions FOR DELETE USING (is_admin());
CREATE POLICY "Admin delete trust_stats" ON trust_stats FOR DELETE USING (is_admin());
