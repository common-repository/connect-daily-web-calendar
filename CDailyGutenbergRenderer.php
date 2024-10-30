<?php
/**
  * Copyright 2018, MH Software, Inc.
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
  * This class implements rendering Connect Daily gutenberg 
  * block output. 
  *  
 */
class CDailyGutenbergRenderer  {

    private $plugin = null;

    const BLOCK_PREFIX = 'connect-daily-web-calendar-';
    const BLOCK_NAME = 'gblock';
    const QUALIFIED_BLOCK_NAME = 'connect-daily-web-calendar-gblock';

    public function __construct($plugin) {
        $this->plugin = $plugin;

        register_block_type(substr(CDailyGutenbergRenderer::BLOCK_PREFIX, 0, -1) . '/' . CDailyGutenbergRenderer::BLOCK_NAME,
                            array(
                                'style' => CDailyGutenbergRenderer::QUALIFIED_BLOCK_NAME,
                                'editor_style' => CDailyGutenbergRenderer::QUALIFIED_BLOCK_NAME . '-editor',
                                'editor_script' => CDailyGutenbergRenderer::QUALIFIED_BLOCK_NAME . '-editor',
                                'render_callback' => array($this, 'renderGutenberg')
                                )
                           );
    }


    /**
     * Render our Gutenberg Block's content
     * 
     * @author gsexton (11/23/18)
     * 
     * @param $attributes 
     * @param $content 
     * 
     * @return mixed 
     */
    public function renderBlock($attributes = null, $content = null) {
        $s = '';

        switch ($attributes['widget_type']) {
        case 'monthview':
            $s = 'MONTH VIEW';
            break;
        case 'addevent':
        case 'event':
        case 'detailedlist':
        case 'simplelist':
        case 'filter':
        case 'minicalendar':
        case 'icalendar':
        case 'search':
        case 'iframe':
            break;
        default:
            $s = 'Unhandled Render for Widget Type: ' . $attributes['widget_type'];
            break;
        }
        return $s;
    }

    public function registerStyles() {
        wp_register_style(CDailyGutenbergRenderer::QUALIFIED_BLOCK_NAME,
                          plugins_url('/blocks/' . CDailyGutenbergRenderer::BLOCK_NAME . '/style.css', __FILE__),
                          array(),
                          filemtime(plugin_dir_path(__FILE__) . 'blocks/' . CDailyGutenbergRenderer::BLOCK_NAME . '/style.css')
                         );
        wp_enqueue_style(CDailyGutenbergRenderer::QUALIFIED_BLOCK_NAME);
    }

    public function registerScripts() {
        wp_register_style(CDailyGutenbergRenderer::QUALIFIED_BLOCK_NAME . '-editor',
                          plugins_url('/blocks/' . CDailyGutenbergRenderer::BLOCK_NAME . '/editor-style.css', __FILE__),
                          array('wp-edit-blocks'),
                          filemtime(plugin_dir_path(__FILE__) . 'blocks/' . CDailyGutenbergRenderer::BLOCK_NAME . '/editor-style.css')
                         );
        wp_enqueue_style(CDailyGutenbergRenderer::QUALIFIED_BLOCK_NAME . '-editor');

        wp_register_script(CDailyGutenbergRenderer::QUALIFIED_BLOCK_NAME . '-editor',
                           plugins_url('blocks/' . CDailyGutenbergRenderer::BLOCK_NAME . '/editor-script.js', __FILE__),
                           array('wp-blocks', 'wp-element', 'wp-i18n')
                          );
        wp_set_script_translations(CDailyGutenbergRenderer::QUALIFIED_BLOCK_NAME . '-editor',
                                   CDailyPlugin::CAPTION_BUNDLE,
                                   plugin_dir_path(__FILE__) . 'captions');
    }

    public function renderGutenberg($atts, $content=null){
        $this->plugin->markUsed();     
        if (!array_key_exists('widget_type',$atts)) {
            $atts['widget_type']='monthview';
        }
        foreach(array('approved' => '1') as $key => $value ) {
                if (!array_key_exists($key,$atts)) {
                    $atts[$key]=$value;
                }
            }
        $widget=$atts['widget_type'];
        if ($widget == 'singleevent') {
            $widget='event';
        }
        if (!array_key_exists('by_method',$atts)) {
            $atts['by_method']='calendar_id';
        }
        $suffix = ']';
        $s='[cdaily_'.$widget.' ';
        foreach($atts as $key => $value) {
            switch ($key) {
            case 'other_options':
                $s.=' '.$value;
                break;
            case 'widget_type':
                break;
            case 'maxcount':
            case 'dayspan':
                if ($widget=='detailedlist' || $widget=='simplelist') {
                    $s.=' '.$key.'="'.$value.'"';
                }
                break;
            case 'content':
                if ($widget=='icalendar' && $value==null) {
                    $value='AUTO';
                }
            case 'title':
                if ($widget=='icalendar' && $value) {
                    $suffix.=$value.'[/cdaily_'.$widget.']';
                } else {
                    $s.=' '.$key.'="'.$value.'"';
                }
                break;
            default:
                $s.=' '.$key.'="'.$value.'"';
                break;
            }
        }
        return do_shortcode($s.$suffix);
    }
}

