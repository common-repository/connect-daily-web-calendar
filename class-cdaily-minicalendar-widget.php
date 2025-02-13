<?php
/**
  * Copyright 2013, MH Software, Inc.
  *
  * This program is free software; you can redistribute it and/or
  * modify it under the terms of the GNU General Public License
  * as published by the Free Software Foundation; either version 2
  * of the License, or (at your option) any later version.
  * This program is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  * GNU General Public License for more details.
  * You should have received a copy of the GNU General Public License
  * along with this program; if not, write to the Free Software
  * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/
/**
 * This class implements a widget for a Mini-Calendar of events.
 *
 * @author gsexton (12/12/2012)
 */
require_once 'detailed-list.php';
require_once 'class-cdaily-datetime.php';

/**
 * Render a month view calendar. This mimics the wordpress
 * wp_get_calendar() function so that appearance and style are
 * identical.
 *
 */
class  CDaily_MiniCalendarWidget extends WP_Widget {

    private $plugin;

    public function __construct(){
       // construct a widget
        $this->plugin=CDailyWPPlugin::getInstance();
        $widget_ops=array('classname' => 'cdaily_minicalendarwidget',
                          'description' => __('COM_CONNECTDAILY_IntegrationWizardMiniCalendar',CDailyPlugin::CAPTION_BUNDLE));
        parent::__construct(false,$name='connectDaily Mini-Calendar Widget',$widget_ops);
    }



    function widget($args, $instance) {
        // Display the widget on website.
        extract($args);
        $title=apply_filters('widget_title',$instance['title']);
        echo $before_widget;
        if ($title) {
            echo $before_title.$title.$after_title;
        }
        $renderer=new CDCalendarWriter($this->plugin);
        echo $renderer->renderMiniCalendar($instance,'cdaily-mini-calendar-'.intval($args['id']));
        echo $after_widget;
    }

    function update($new_instance,$old_instance){
        // Save Widget Options
        $instance=$old_instance;
        $instance['title']=strip_tags($new_instance['title']);
        $instance['by_method']=strip_tags($new_instance['by_method']);
        $instance['by_id']=strip_tags($new_instance['by_id']);
        $instance['other_options']=strip_tags($new_instance['other_options']);
	$this->plugin->markUsed();
        return $instance;
    }

    function form($instance) {
        
        // Form to display widget settings in WordPress Admin
        extract(shortcode_atts(array(
            "title"         => '',
            "by_id"         => '-1',
            "by_method"     => 'calendar_id',
            "other_options" => ''
        ), $instance));
        if (empty($by_id)) {
            $by_id=-1;
        }
        ?>
<script>
jQuery(document).ready(function (){
    var selWidget=document.getElementById("<?php echo $this->get_field_id('by_method'); ?>");
    CDaily.initForDropdownFromMethod(selWidget,<?php echo $by_id; ?>);
});
</script>
<a style="float: right;" tabindex="-1" 
    title="<?php _e('COM_CONNECTDAILY_Help',CDailyPlugin::CAPTION_BUNDLE); ?>"
    class="IconLink HelpSmall" 
    href="<?php echo CDailyPlugin::HELP_PAGE; ?>WordPressMiniCalendarWidget.html" 
    target=_blank></a>
<br>
<p>
<label for="<?php echo $this->get_field_id('title'); ?>">
            <?php _e('COM_CONNECTDAILY_Title',CDailyPlugin::CAPTION_BUNDLE); ?></label>
<input class="widefat" id="<?php echo $this->get_field_id('title'); ?>"
name="<?php echo $this->get_field_name('title'); ?>" type="text"
placeholder="<?php echo _e('COM_CONNECTDAILY_OptionalPlaceHolder',CDailyPlugin::CAPTION_BUNDLE); ?>"
value="<?php echo $title; ?>">
</p>
<p>
<label for="<?php echo $this->get_field_id('by_method'); ?>">
        <?php _e('COM_CONNECTDAILY_SHOW_BY',CDailyPlugin::CAPTION_BUNDLE); ?></label>
<br>
        <?php echo $this->plugin->getByMethodDropdown($by_method,$this->get_field_name('by_method'),$this->get_field_id('by_method')); ?>
</p>
<p>
<label for="<?php echo $this->get_field_id('by_id'); ?>">
        <?php _e('COM_CONNECTDAILY_SHOW_FOR',CDailyPlugin::CAPTION_BUNDLE); ?></label>
<br>
<select name="<?php echo $this->get_field_name('by_id'); ?>" id="<?php echo $this->get_field_id('by_id'); ?>">
</select>
</p>
<p>
<label for="<?php echo $this->get_field_id('other_options'); ?>">
        <?php _e('COM_CONNECTDAILY_UncatOptions',CDailyPlugin::CAPTION_BUNDLE); ?></label>
        <a target=_blank class="dashicons dashicons-editor-help" href="<?php echo CDailyPlugin::HELP_PAGE; ?>WPPluginOptions.html"></a>
<br>
<input class="widefat" id="<?php echo $this->get_field_id('other_options'); ?>"
placeholder="<?php echo _e('COM_CONNECTDAILY_OptionalPlaceHolder',CDailyPlugin::CAPTION_BUNDLE); ?>"
name="<?php echo $this->get_field_name('other_options'); ?>" type="text"
value="<?php echo htmlspecialchars($other_options); ?>">
</p>

        <?php
    }
}
