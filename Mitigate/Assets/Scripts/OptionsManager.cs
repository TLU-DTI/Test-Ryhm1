using UnityEngine;
using UnityEngine.UI;

public class OptionsManager : MonoBehaviour
{
    public static OptionsManager Instance;
    public GameObject mainMenu;
    public GameObject settingsMenu;
    public Button generalButton;
    public Button audioButton;
    public Button optionsButton;
    public Button backButton;
    public GameObject generalSettings;
    public GameObject audioSettings;
    public Button selectedButton;

    private const string MasterVolumeKey = "MasterVolume";
    private const string MusicVolumeKey = "MusicVolume";
    private const string AudioVolumeKey = "AudioVolume";

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
            Debug.Log("OptionsManager instance created.");
        }
        else
        {
            Destroy(gameObject);
            Debug.Log("Duplicate OptionsManager instance destroyed.");
        }
    }

    private void Start()
    {
        if (mainMenu != null && settingsMenu != null)
        {
            Debug.Log("UI elements already assigned.");
            InitializeUI();
        }
        else
        {
            Debug.LogWarning("UI elements are not assigned in the Start method.");
        }
    }

    public void SaveSettings(float masterVolume, float musicVolume, float audioVolume)
    {
        PlayerPrefs.SetFloat(MasterVolumeKey, masterVolume);
        PlayerPrefs.SetFloat(MusicVolumeKey, musicVolume);
        PlayerPrefs.SetFloat(AudioVolumeKey, audioVolume);
        PlayerPrefs.Save();
        Debug.Log("Settings saved.");
    }

    public void LoadSettings(out float masterVolume, out float musicVolume, out float audioVolume)
    {
        masterVolume = PlayerPrefs.GetFloat(MasterVolumeKey, 1f);
        musicVolume = PlayerPrefs.GetFloat(MusicVolumeKey, 1f);
        audioVolume = PlayerPrefs.GetFloat(AudioVolumeKey, 1f);
        Debug.Log("Settings loaded.");
    }

    public void OpenOptions()
    {
        Debug.Log("OpenOptions called. mainMenu: " + (mainMenu != null) + ", settingsMenu: " + (settingsMenu != null));
        mainMenu.SetActive(false);
        settingsMenu.SetActive(true);
    }

    public void CloseOptions()
    {
        Debug.Log("CloseOptions called. mainMenu: " + (mainMenu != null) + ", settingsMenu: " + (settingsMenu != null));
        mainMenu.SetActive(true);
        settingsMenu.SetActive(false);
    }

    public void SelectGeneralSettings()
    {
        if (selectedButton == generalButton) return;

        generalSettings.SetActive(true);
        audioSettings.SetActive(false);

        generalButton.interactable = false;
        audioButton.interactable = true;

        selectedButton = generalButton;
    }

    public void SelectAudioSettings()
    {
        if (selectedButton == audioButton) return;

        generalSettings.SetActive(false);
        audioSettings.SetActive(true);

        generalButton.interactable = true;
        audioButton.interactable = false;

        selectedButton = audioButton;
    }

    private void InitializeUI()
    {
        selectedButton = generalButton;
        generalButton.interactable = false;
        audioButton.interactable = true;

        generalButton.onClick.AddListener(SelectGeneralSettings);
        audioButton.onClick.AddListener(SelectAudioSettings);
        optionsButton.onClick.AddListener(OpenOptions);
        backButton.onClick.AddListener(CloseOptions);
    }

    public void AssignUIElements(GameObject mainMenu, GameObject settingsMenu, Button generalButton, Button audioButton, GameObject generalSettings, GameObject audioSettings, Button optionsButton, Button backButton)
    {
        Debug.Log(mainMenu.name + ", " + settingsMenu.name + ", " + generalButton.name + ", " + audioButton.name + ", " + generalSettings.name + ", " + audioSettings.name + ", " + optionsButton.name + ", " + backButton.name);
        this.mainMenu = mainMenu;
        this.settingsMenu = settingsMenu;
        this.generalButton = generalButton;
        this.audioButton = audioButton;
        this.generalSettings = generalSettings;
        this.audioSettings = audioSettings;
        this.optionsButton = optionsButton;
        this.backButton = backButton;

        Debug.Log("AssignUIElements called. mainMenu: " + (mainMenu != null) + ", settingsMenu: " + (settingsMenu != null));

        if (mainMenu == null || settingsMenu == null || generalButton == null || audioButton == null || generalSettings == null || audioSettings == null || optionsButton == null || backButton == null)
        {
            Debug.LogError("One or more UI elements are not assigned correctly in the scene.");
            return;
        }

        InitializeUI();
        Debug.Log("UI elements assigned.");
    }
}
