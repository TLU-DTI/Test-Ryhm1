using UnityEngine;
using UnityEngine.UI;

public class SettingsUI : MonoBehaviour
{
    [SerializeField] private Slider masterVolumeSlider;
    [SerializeField] private Slider musicVolumeSlider;
    [SerializeField] private Slider audioVolumeSlider;
    [SerializeField] private GameObject mainMenu;
    [SerializeField] private GameObject settingsMenu;
    [SerializeField] private Button generalButton;
    [SerializeField] private Button audioButton;
    [SerializeField] private GameObject generalSettings;
    [SerializeField] private GameObject audioSettings;
    [SerializeField] private Button optionsButton;
    [SerializeField] private Button backButton;

    private void Start()
    {
        Debug.Log("SettingsUI Start called.");

        float masterVolume, musicVolume, audioVolume;
        OptionsManager.Instance.LoadSettings(out masterVolume, out musicVolume, out audioVolume);

        masterVolumeSlider.value = masterVolume;
        musicVolumeSlider.value = musicVolume;
        audioVolumeSlider.value = audioVolume;

        masterVolumeSlider.onValueChanged.AddListener(OnMasterVolumeChanged);
        musicVolumeSlider.onValueChanged.AddListener(OnMusicVolumeChanged);
        audioVolumeSlider.onValueChanged.AddListener(OnAudioVolumeChanged);

        OptionsManager.Instance.AssignUIElements(
            mainMenu, settingsMenu, generalButton, audioButton, generalSettings, audioSettings, optionsButton, backButton);

        if (OptionsManager.Instance.selectedButton != null)
        {
            OptionsManager.Instance.selectedButton.Select();
        }

        generalButton.onClick.AddListener(() => OptionsManager.Instance.SelectGeneralSettings());
        audioButton.onClick.AddListener(() => OptionsManager.Instance.SelectAudioSettings());
        optionsButton.onClick.AddListener(() => OptionsManager.Instance.OpenOptions());
        backButton.onClick.AddListener(() => OptionsManager.Instance.CloseOptions());
    }

    private void OnMasterVolumeChanged(float value)
    {
        SaveSettings();
    }

    private void OnMusicVolumeChanged(float value)
    {
        SaveSettings();
    }

    private void OnAudioVolumeChanged(float value)
    {
        SaveSettings();
    }

    private void SaveSettings()
    {
        OptionsManager.Instance.SaveSettings(
            masterVolumeSlider.value,
            musicVolumeSlider.value,
            audioVolumeSlider.value);
    }
}
